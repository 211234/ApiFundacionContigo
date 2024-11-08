// notificationController.ts
import { Request, Response } from 'express';
import { SendEmailNotificationUseCase } from '../../../application/use-cases/sendEmailNotificationUseCase';
import { SendEmailNotificationDTO } from '../dtos/notificationDTO';

export class NotificationController {
    private sendEmailNotificationUseCase: SendEmailNotificationUseCase;

    constructor() {
        this.sendEmailNotificationUseCase = new SendEmailNotificationUseCase();
    }

    public async sendEmailNotification(req: Request, res: Response): Promise<Response> {
        try {
            const { email, confirmationToken } = req.body as SendEmailNotificationDTO;

            await this.sendEmailNotificationUseCase.execute({ email, confirmationToken });

            return res.status(200).json({ message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending email notification:', error);
            return res.status(500).json({ error: 'Failed to send notification' });
        }
    }
}
