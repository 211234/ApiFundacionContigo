import { RabbitMQConnection } from '../../../infrastructure/config/rabbitMQ';

export class RabbitMQPublisher {
    public async publish(eventType: string, payload: any) {
        const channel = await RabbitMQConnection.init();

        const event = { type: eventType, payload };
        channel.publish('userEventsExchange', '', Buffer.from(JSON.stringify(event)));
        console.log(`Evento publicado: ${eventType}, payload:`, payload);
    }
}
