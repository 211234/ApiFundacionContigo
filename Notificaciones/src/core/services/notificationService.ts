// notificationService.ts
import { Notification } from '../../core/domain/entities/notification';
import { RabbitMQPublisher } from '../../adapaters/out/queue/rabbitMQPublisher';
import { SendEmailNotificationDTO } from '../../adapaters/in/dtos/notificationDTO';

export class NotificationService {
    private readonly queueName = 'email_notifications';
    private publisher: RabbitMQPublisher;

    constructor() {
        this.publisher = new RabbitMQPublisher(this.queueName);
    }

    /**
     * Enviar una notificación por correo electrónico.
     * @param data Objeto de tipo SendEmailNotificationDTO con los datos del destinatario y el token.
     */
    public async sendEmailNotification(data: SendEmailNotificationDTO): Promise<void> {
        const { email, confirmationToken } = data;

        // Crear una instancia de Notification (Value Object)
        const notification = new Notification(
            email,
            confirmationToken,
            'Confirmación de Cuenta',
            'Por favor, confirma tu cuenta utilizando el siguiente token.'
        );

        try {
            // Conectar al servidor RabbitMQ
            await this.publisher.connect();

            // Publicar el mensaje en la cola RabbitMQ
            await this.publisher.publish({
                email: notification.getEmail(),
                subject: notification.getSubject(),
                message: notification.getFormattedMessage(),
                timestamp: notification.getTimestamp()
            });

            console.log(`Notification sent to ${notification.getEmail()}`);
        } catch (error) {
            console.error('Failed to send notification:', error);
            throw new Error('Error al enviar la notificación.');
        } finally {
            // Cerrar la conexión a RabbitMQ
            await this.publisher.close();
        }
    }
}
