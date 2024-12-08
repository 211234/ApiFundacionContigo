import amqp from 'amqplib';
import { RabbitMQConnection, rabbitMQConfig } from '../../../infrastructure/config/rabbitMQConfig';

export class RabbitMQPublisher {
    public async publish(eventType: string, payload: any): Promise<void> {
        try {
            const channel = await RabbitMQConnection.init();
            const message = JSON.stringify({
                type: eventType,
                payload,
                timestamp: new Date().toISOString(),
            });

            console.log(`Publicando evento: ${eventType} con payload:`, payload);
            channel.publish(rabbitMQConfig.paymentExchange, '', Buffer.from(message));
            console.log(`Evento publicado exitosamente: ${eventType}`);
        } catch (error) {
            console.error('Error publicando evento:', error);
        }
    }
}
