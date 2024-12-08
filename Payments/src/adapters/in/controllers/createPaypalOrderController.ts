import { Request, Response, NextFunction } from 'express';
import { createOrder } from '../../../core/payments/services/paypalService';
import { TransaccionesRepository } from '../../../adapters/out/database/transacciones/transaccionesRepository';
import { v4 as uuidv4 } from 'uuid';

export const createPaypalOrderController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { total, id_usuario } = req.body;

    if (!total || !id_usuario) {
        res.status(400).json({ error: 'El total y el id_usuario son requeridos' });
    }

    try {
        // Crea la orden en PayPal
        const order = await createOrder(total);

        // Guarda el ID de la transacción en tu base de datos como "pendiente"
        const transaccionesRepository = new TransaccionesRepository();
        await transaccionesRepository.create({
            id: uuidv4(),
            id_usuario: id_usuario,
            total,
            paypal_order_id: order.id,
            estado_id: 1, // Estado inicial
            metadata: {
                paypalOrderId: order.id,
            },
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(201).json({
            id: order.id,
            status: order.status,
            links: order.links, // Enlaces para redirigir al cliente a PayPal
        });
    } catch (error) {
        console.error('Error al crear la orden en PayPal:', error);
        next(error); // Delegar el error al middleware global
    }
};
