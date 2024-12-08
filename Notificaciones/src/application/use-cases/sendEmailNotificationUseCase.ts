import { NotificationDTO } from '../../adapaters/in/dtos/notificationDTO';
import { notificationService } from '../../core/services/notificationService';

export class SendEmailNotificationUseCase {
    async execute(notification: NotificationDTO) {
        await notificationService.sendEmail(notification);
    }
}
