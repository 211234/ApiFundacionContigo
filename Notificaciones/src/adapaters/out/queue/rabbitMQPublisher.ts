import { rabbitMQConfig, RabbitMQConnection } from '../../../infrastructure/config/rabbitMQ';

export class RabbitMQPublisher {
    public async publish(eventType: string, payload: any) {
        const channel = await RabbitMQConnection.init();
        const event = { type: eventType, payload };
        console.log(`Publicando evento: ${eventType}, con payload:`, payload); // Agregar este log
        channel.publish(rabbitMQConfig.notificationExchange, '', Buffer.from(JSON.stringify(event)));
        console.log(`Evento publicado exitosamente: ${eventType}`);
    }
}
