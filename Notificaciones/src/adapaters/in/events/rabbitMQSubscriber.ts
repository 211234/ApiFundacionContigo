import amqp from 'amqplib';
import { ProcessUserCreatedEventUseCase } from '../../../application/use-cases/processUserCreatedEventUseCase';
import { RabbitMQConnection, rabbitMQConfig } from '../../../infrastructure/config/rabbitMQ';
import { NotificationService } from '../../../core/services/notificationService';

export class RabbitMQSubscriber {
    private processUserCreatedEventUseCase: ProcessUserCreatedEventUseCase;
    private notificationService: NotificationService;

    constructor() {
        this.processUserCreatedEventUseCase = new ProcessUserCreatedEventUseCase();
        this.notificationService = new NotificationService();
    }

    public async subscribe(): Promise<void> {
        const channel = RabbitMQConnection.getChannel();

        // Consumir eventos USER_CONFIRMED
        channel.consume(rabbitMQConfig.userConfirmationQueue, async (msg: amqp.ConsumeMessage | null) => {
            if (msg) {
                const event = JSON.parse(msg.content.toString());
                console.log(`[NOTIFICATIONS] Evento recibido: ${event.event}`);

                switch (event.type) {
                    case 'USER_CREATED':
                        await this.processUserCreatedEventUseCase.execute(event.payload);
                        break;
                    case 'USER_CONFIRMED':
                        await this.processUserConfirmedEvent(event.payload);
                        break;
                }

                channel.ack(msg);
            }
        });

        // Consumir eventos PAYMENT_COMPLETED
        channel.consume(rabbitMQConfig.paymentNotificationQueue, async (msg: amqp.ConsumeMessage | null) => {
            if (msg) {
                const event = JSON.parse(msg.content.toString());
                console.log(`[NOTIFICATIONS] Evento recibido: ${event.event}`);

                if (event.event === 'PAYMENT_COMPLETED') {
                    await this.handlePaymentCompleted(event.data);
                }
                channel.ack(msg);
            }
        });
    }

    private async processUserConfirmedEvent(payload: any): Promise<void> {
        try {
            console.log(`[NOTIFICATIONS] Procesando evento USER_CONFIRMED para el usuario: ${payload.id_usuario}`);
        } catch (error) {
            console.error('[NOTIFICATIONS] Error procesando USER_CONFIRMED:', error);
        }
    }

    private async handlePaymentCompleted(payload: any): Promise<void> {
        console.log('[NOTIFICATIONS] Procesando evento PAYMENT_COMPLETED:', payload);

        const { id_usuario, correo, total } = payload;

        if (!correo) {
            console.error('[NOTIFICATIONS] Correo no encontrado en el payload.');
            return;
        }

        await this.notificationService.sendEmail({
            to: correo,
            subject: 'Tu pago ha sido procesado exitosamente',
            message: `Monto: $${total}. Gracias por tu donación.`,
        });

        console.log('[NOTIFICATIONS] Correo enviado exitosamente a:', correo);
    }
    
}
