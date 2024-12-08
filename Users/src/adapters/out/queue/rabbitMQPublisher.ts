import amqp from 'amqplib';
import { EventPublisherPort } from '../../../application/users/ports/eventPublisherPort';
import { rabbitMQConfig } from '../../../infrastructure/config/rabbitMQ';

export class RabbitMQPublisher implements EventPublisherPort {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private exchangeName: string = 'notificationEventsExchange';
    private queueName: string = 'userServiceQueue';

    constructor() {
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            console.log('Conectando a RabbitMQ...');
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            await this.channel.assertQueue(this.queueName, { durable: false });
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');
    
            console.log('RabbitMQ Publisher connected ✅');
        } catch (error) {
            console.error('Error al conectar a RabbitMQ:', error);
            throw new Error('Error al conectar a RabbitMQ');
        }
    }
    
    public async publish(event: string, data: any): Promise<void> {
        try {
            // Si el canal no está inicializado, nos reconectamos.
            if (!this.channel) {
                console.error('[ERROR] Channel not initialized. Ensuring RabbitMQ connection...');
                await this.connect();
            }
            const message = JSON.stringify({
                event,
                data,
                timestamp: new Date().toISOString(),
            });
            this.channel.publish(rabbitMQConfig.notificationExchange, '', Buffer.from(message));
            console.log(`Event published: ${event}`, data);
        } catch (error) {
            console.error('Error publishing event:', error);
        }
    }          

    public async publishTransactionEvent(transactionId: string, status: string, userId: string, total: number, correo: string): Promise<void> {
        const event = {
            type: 'TRANSACTION_EVENT',
            payload: {
                transactionId,
                status,
                userId,
                total,
                correo,
            },
            timestamp: new Date().toISOString(),
        };
    
        try {
            console.log('[DEBUG] Preparing to publish TRANSACTION_EVENT');
            console.log('[DEBUG] Event payload:', event.payload);
    
            // Publicar el evento en RabbitMQ
            this.channel.publish(this.exchangeName, '', Buffer.from(JSON.stringify(event)));
    
            console.log('[DEBUG] TRANSACTION_EVENT published successfully');
        } catch (error) {
            console.error('[ERROR] Error publishing TRANSACTION_EVENT:', error);
        }
    }    

    public async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
