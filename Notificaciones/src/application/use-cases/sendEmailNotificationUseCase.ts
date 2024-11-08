// src/application/use-cases/sendEmailNotificationUseCase.ts
import { RabbitMQPublisher } from '../../adapaters/out/queue/rabbitMQPublisher';
import { Notification } from '../../core/domain/entities/notification';
import { SendEmailNotificationDTO } from '../../adapaters/in/dtos/notificationDTO';

export class SendEmailNotificationUseCase {
    private readonly queueName = 'email_notifications';
    private publisher: RabbitMQPublisher;

    constructor() {
        this.publisher = new RabbitMQPublisher(this.queueName);
        this.initializePublisher();
    }

    // Inicializar el Publisher solo una vez
    private async initializePublisher() {
        await this.publisher.connect();
    }

    public async execute(data: SendEmailNotificationDTO): Promise<void> {
        const { email, confirmationToken } = data;

        const notification = new Notification(
            email,
            confirmationToken,
            'Confirmación de Cuenta',
            'Por favor, confirma tu cuenta utilizando el siguiente token.'
        );

        // Publicar el mensaje
        await this.publisher.publish({
            email: notification.getEmail(),
            subject: notification.getSubject(),
            message: notification.getFormattedMessage(),
            timestamp: notification.getTimestamp(),
        });

        console.log(`Notification sent to email: ${email}`);
    }
}
