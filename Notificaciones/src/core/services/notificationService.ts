import { GmailService } from '../../adapaters/out/email/gmailService';
import { NotificationDTO } from '../../adapaters/in/dtos/notificationDTO';

export class NotificationService {
    private gmailService = new GmailService();

    async sendEmail(notification: NotificationDTO) {
        await this.gmailService.sendConfirmationEmail(notification.to, notification.subject, notification.message);
    }
}

export const notificationService = new NotificationService();
