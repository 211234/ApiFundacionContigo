import { Request, Response } from 'express';
import { SendEmailNotificationUseCase } from '../../../application/use-cases/sendEmailNotificationUseCase';

export class NotificationController {
    async sendEmail(req: Request, res: Response) {
        const { to, subject, message } = req.body;

        try {
            const sendEmailNotificationUseCase = new SendEmailNotificationUseCase();
            await sendEmailNotificationUseCase.execute({ to, subject, message });
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error sent Email', error });
        }
    }
}
