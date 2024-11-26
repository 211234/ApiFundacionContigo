import amqp from 'amqplib';
import { EventPublisherPort } from '../../../application/users/ports/eventPublisherPort';

export class RabbitMQPublisher implements EventPublisherPort {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private exchangeName: string = 'userEventsExchange';
    private queueName: string = 'userServiceQueue';

    constructor() {
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL || '');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', { durable: false });
            await this.channel.assertQueue(this.queueName, { durable: false });
            await this.channel.bindQueue(this.queueName, this.exchangeName, '');

            console.log('RabbitMQ Publisher connected ✅');
        } catch (error) {
            console.error('RabbitMQ connection error:', error);
        }
    }

    public async publish(event: string, data: any): Promise<void> {
        try {
            const message = JSON.stringify({
                event,
                data,
                timestamp: new Date().toISOString()
            });
            this.channel.publish(this.exchangeName, '', Buffer.from(message));
            console.log(`Event published: ${event}`, data);
        } catch (error) {
            console.error('Error publishing event:', error);
        }
    }

    public async close(): Promise<void> {
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
    }
}
