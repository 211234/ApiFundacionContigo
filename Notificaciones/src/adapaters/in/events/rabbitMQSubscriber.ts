import amqp from 'amqplib';
import { ProcessUserCreatedEventUseCase } from '../../../application/use-cases/processUserCreatedEventUseCase';
import { RabbitMQConnection, rabbitMQConfig } from '../../../infrastructure/config/rabbitMQ';

export class RabbitMQSubscriber {
    private processUserCreatedEventUseCase: ProcessUserCreatedEventUseCase;

    constructor() {
        this.processUserCreatedEventUseCase = new ProcessUserCreatedEventUseCase();
    }

    public async subscribe() {
        await RabbitMQConnection.init(); // Inicializar conexión
        const channel = RabbitMQConnection.getChannel(); // Obtener canal

        channel.consume(rabbitMQConfig.notificationQueue, async (msg: amqp.ConsumeMessage | null) => {
            if (msg) {
                try {
                    const event = JSON.parse(msg.content.toString());
                    console.log(`Received event: ${event.type}`);

                    switch (event.type) {
                        case 'USER_CREATED':
                            await this.processUserCreatedEventUseCase.execute(event.payload);
                            break;
                        case 'USER_CONFIRMED':
                            await this.processUserConfirmedEvent(event.payload);
                            break;
                        default:
                            console.warn(`Unhandled event type: ${event.type}`);
                    }

                    // Confirmar que el mensaje se procesó correctamente
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);

                    if (msg.fields.redelivered) {
                        console.log('Mensaje redelivered. Enviando a DLQ...');
                        channel.reject(msg, false); // Mueve el mensaje a la DLQ
                    } else {
                        console.log('Reintentando mensaje...');
                        channel.nack(msg, false, true); // Reintenta el procesamiento
                    }
                }
            }
        });
    }

    private async processUserConfirmedEvent(payload: any) {
        try {
            console.log(`Processing USER_CONFIRMED event for user: ${payload.id_usuario}`);
            // Aquí podrías enviar una notificación o actualizar algún estado
        } catch (error) {
            console.error('Error processing USER_CONFIRMED event:', error);
        }
    }
}
