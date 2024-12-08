import amqp from 'amqplib';
import { PaymentService } from '../../../core/payments/services/paymentService';

export class RabbitMQSubscriber {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private readonly exchangeName = 'paymentEventsExchange';
    private readonly queueName = 'donationCreatedQueue';
    private readonly paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            await this.channel.assertQueue(this.queueName, { durable: false });

            // Vincular la cola al exchange
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');

            this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    const event = JSON.parse(msg.content.toString());
                    console.log(`[PAYMENTS] Evento recibido DONATION_CREATED:`, event);
                    await this.handleDonationCreated(event.data);
                    this.channel.ack(msg);
                }
            });

            console.log(`[PAYMENTS] Escuchando eventos en la cola ${this.queueName} ✅`);
        } catch (error) {
            console.error('Error de conexión a RabbitMQ:', error);
        }
    }

    private async handleDonationCreated(data: { id_usuario: string; total: number; metadata: object }): Promise<void> {
        try {
            console.log('[PAYMENTS] Procesando DONATION_CREATED:', data);
            const transaction = await this.paymentService.createPayment(data.id_usuario, data.total, data.metadata);
            console.log('[PAYMENTS] Transacción creada en la base de datos:', transaction);
        } catch (error) {
            console.error('[PAYMENTS] Error procesando DONATION_CREATED:', error);
        }
    }

    public async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
