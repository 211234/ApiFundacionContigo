import amqp from 'amqplib';
import { UserService } from '../../../../core/users/services/servicesUser';
import { EventRepository } from '../../../../core/users/repositories/eventRepository';

export class RabbitMQSubscriber {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private readonly exchangeName = 'userEventsExchange';
    private readonly queueName = 'userConfirmedQueue';
    private readonly transactionQueue = 'transactionEventQueue';
    private readonly eventRepository: EventRepository;

    constructor(private readonly userService: UserService, eventRepository: EventRepository) {
        this.eventRepository = eventRepository;
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            await this.channel.assertQueue(this.queueName, { durable: false });
            await this.channel.assertQueue(this.transactionQueue, { durable: false });

            // Vincular las colas al exchange
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');
            await this.channel.bindQueue(this.transactionQueue, this.exchangeName, '');

            // Escuchar eventos USER_CONFIRMED
            this.channel.consume(this.queueName, async (msg) => {
                if (msg) {
                    const message = JSON.parse(msg.content.toString());
                    console.log(`[USERS] Evento recibido USER_CONFIRMED:`, message);

                    if (message.event === 'USER_CONFIRMED') {
                        await this.handleUserConfirmed(message.data.id_usuario, message.data.eventId);
                    }

                    this.channel.ack(msg);
                }
            });

            // Escuchar eventos TRANSACTION_EVENT
            this.channel.consume(this.transactionQueue, async (msg) => {
                if (msg) {
                    const message = JSON.parse(msg.content.toString());
                    console.log(`[USERS] Evento recibido TRANSACTION_EVENT:`, message);

                    if (message.type === 'TRANSACTION_EVENT') {
                        await this.handleTransactionEvent(message.payload);
                    }

                    this.channel.ack(msg);
                }
            });

            console.log(`[USERS] Escuchando eventos en las colas ${this.queueName} y ${this.transactionQueue} ✅`);
        } catch (error) {
            console.error('RabbitMQ connection error:', error);
        }
    }

    private async handleUserConfirmed(id_usuario: string, eventId: string): Promise<void> {
        try {
            const alreadyProcessed = await this.eventRepository.isEventProcessed(eventId);
            if (alreadyProcessed) {
                console.log(`Evento ${eventId} ya fue procesado. Ignorando.`);
                return;
            }

            console.log(`Procesando confirmación de usuario con ID: ${id_usuario}`);
            await this.userService.updateVerificationStatus(id_usuario, 'confirmado', false);
            await this.eventRepository.saveEvent(eventId, 'USER_CONFIRMED');
        } catch (error) {
            console.error(`Error procesando el evento ${eventId}:`, error);
        }
    }

    private async handleTransactionEvent(payload: {
        transactionId: string;
        status: string;
        userId: string;
        total: number;
        correo: string;
    }): Promise<void> {
        try {
            console.log('[USERS] Procesando TRANSACTION_EVENT:', payload);

            if (payload.status === 'COMPLETED') {
                console.log(`[USERS] Transacción ${payload.transactionId} completada para usuario ${payload.userId}`);
            }
        } catch (error) {
            console.error('[USERS] Error procesando TRANSACTION_EVENT:', error);
        }
    }

    public async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
