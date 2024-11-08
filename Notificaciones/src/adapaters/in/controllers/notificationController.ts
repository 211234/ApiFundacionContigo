import { Request, Response, NextFunction } from 'express';
import { SendEmailNotificationUseCase } from '../../../application/use-cases/sendEmailNotificationUseCase';
import { SendEmailNotificationDTO } from '../dtos/notificationDTO';

export class NotificationController {
    private sendEmailNotificationUseCase: SendEmailNotificationUseCase;

    constructor() {
        this.sendEmailNotificationUseCase = new SendEmailNotificationUseCase();
    }

    // Cambiado a una función middleware compatible con Express
    public sendEmailNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, confirmationToken } = req.body as SendEmailNotificationDTO;
            
            await this.sendEmailNotificationUseCase.execute({ email, confirmationToken });

            res.status(200).json({ message: 'Notification sent successfully' });
        } catch (error) {
            console.error('Error sending email notification:', error);
            next(error); // Usa `next` para pasar el error a los middlewares de manejo de errores
        }
    };
}
