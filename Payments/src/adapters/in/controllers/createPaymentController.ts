import { Request, Response, NextFunction } from 'express';
import { CreatePaymentUseCase } from '../../../application/payments/use-case/createPaymentUseCase';

export class CreatePaymentController {
    constructor(private readonly createPaymentUseCase: CreatePaymentUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { usuarioId, total, metadata } = req.body;
            const result = await this.createPaymentUseCase.execute({ usuarioId, total, metadata });
            res.status(201).json(result);
        } catch (error) {
            console.error('Error al crear el pago:', error);
            next(error); // Delegar el error al middleware global
        }
    }
}
