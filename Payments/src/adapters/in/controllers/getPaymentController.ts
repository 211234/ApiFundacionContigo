import { Request, Response, NextFunction } from 'express';
import { GetPaymentUseCase } from '../../../application/payments/use-case/getPaymentUseCase';

export class GetPaymentController {
    constructor(private readonly getPaymentUseCase: GetPaymentUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const payment = await this.getPaymentUseCase.execute(id);
            res.status(200).json(payment);
        } catch (error) {
            next(error); // Delegar el error al middleware global
        }
    }
}
