import { Request, Response, NextFunction } from 'express';
import { CreateDonationUseCase } from '../../../../application/users/use-cases/createDonationUseCase';
import { CaptureDonationUseCase } from '../../../../application/users/use-cases/captureDonationUseCase';
import { AuthRequest } from '../../../../interfaces/authRequest';
import { RabbitMQPublisher } from '../../../out/queue/rabbitMQPublisher';

export class DonationController {
    constructor(
        private readonly createDonationUseCase: CreateDonationUseCase,
        private readonly captureDonationUseCase: CaptureDonationUseCase
    ) {}

    async createDonation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id_usuario = req.user?.id_usuario;
    
            if (!id_usuario) {
                throw new Error('Usuario no autenticado');
            }
    
            const { total, metadata } = req.body;
    
            // Llama al caso de uso para publicar el evento de creación de donación
            await this.createDonationUseCase.execute({
                id_usuario,
                total,
                metadata,
            });
    
            // Publica un evento para notificar la creación de la donación
            const event = {
                event: 'DONATION_CREATED',
                data: { id_usuario, total, metadata },
            };
            console.log('[DEBUG] Publicando evento DONATION_CREATED:', event);
    
            // Aquí usarías tu instancia de `RabbitMQPublisher`
            const publisher = new RabbitMQPublisher();
            await publisher.publish(event.event, event.data);
    
            res.status(201).json({ message: 'Donación creada y evento publicado' });
        } catch (error) {
            next(error);
        }
    }    

    async captureDonation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id_usuario = req.user?.id_usuario;

            if (!id_usuario) {
                throw new Error('Usuario no autenticado');
            }

            const { orderId } = req.params;

            // Llama al caso de uso para publicar el evento de captura de donación
            await this.captureDonationUseCase.capture(orderId, id_usuario);

            res.status(202).json({ message: 'Captura de donación en proceso' });
        } catch (error) {
            next(error);
        }
    }
}
