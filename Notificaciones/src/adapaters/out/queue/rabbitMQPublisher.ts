// src/adapters/out/queue/rabbitMQPublisher.ts
import amqp, { Connection, Channel } from 'amqplib';

export class RabbitMQPublisher {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly queue: string;

    constructor(queue: string) {
        this.queue = queue;
    }

    // Método para inicializar la conexión con RabbitMQ
    public async connect(): Promise<void> {
        try {
            if (!this.connection) {
                this.connection = await amqp.connect('amqp://localhost');
                this.channel = await this.connection.createChannel();

                if (this.channel) {
                    await this.channel.assertQueue(this.queue, { durable: true });
                }

                console.log('RabbitMQ Publisher connected ✅');
            }
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    // Método para enviar un mensaje a la cola
    public async publish(message: any): Promise<void> {
        try {
            if (!this.channel) {
                console.error('RabbitMQ channel is not initialized.');
                return;
            }

            const messageBuffer = Buffer.from(JSON.stringify(message));
            const isSent = this.channel.sendToQueue(this.queue, messageBuffer, {
                persistent: true,
            });

            if (isSent) {
                console.log(`Message sent to queue ${this.queue}:`, message);
            } else {
                console.error(`Failed to send message to queue ${this.queue}`);
            }
        } catch (error) {
            console.error('Error publishing message to RabbitMQ:', error);
            throw error;
        }
    }

    // Método para cerrar la conexión
    public async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('RabbitMQ Publisher connection closed 🔒');
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
        }
    }
}
