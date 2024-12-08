import { Request, Response, NextFunction } from 'express';
import { TransaccionesRepository } from '../../../adapters/out/database/transacciones/transaccionesRepository';
import { captureOrder } from '../../../core/payments/services/paypalService';
import { RabbitMQPublisher } from '../../../adapters/out/events/rabbitMQPublisher';

export class PaypalWebhookController {
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { event_type, resource } = req.body;

        if (event_type === 'CHECKOUT.ORDER.APPROVED') {
            const paypalOrderId = resource.id;

            try {
                // Captura el pago en PayPal
                const capturedOrder = await captureOrder(paypalOrderId);

                // Obtén la transacción relacionada
                const transaccionesRepository = new TransaccionesRepository();
                const transaccion = await transaccionesRepository.findByPaypalOrderId(paypalOrderId);

                if (!transaccion) throw new Error('Transacción no encontrada');

                // Asegúrate de que metadata tiene la propiedad correo
                const correo = (transaccion.metadata as { correo?: string })?.correo;
                if (!correo) throw new Error('Correo no encontrado en metadata');

                // Publicar evento de correo usando publish
                const publisher = new RabbitMQPublisher();
                await publisher.publish('PAYMENT_COMPLETED', {
                    id_usuario: transaccion.id_usuario,
                    correo,
                    total: transaccion.total,
                });

                res.status(200).send('OK');
            } catch (error) {
                next(error); // Delegar el manejo del error al middleware global
            }
        } else {
            res.status(400).send('Evento no manejado');
        }
    }
}
