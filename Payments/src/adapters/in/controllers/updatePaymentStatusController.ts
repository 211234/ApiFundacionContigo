import { Request, Response, NextFunction } from 'express';
import { UpdatePaymentStatusUseCase } from '../../../application/payments/use-case/updatePaymentStatusUseCase';

export class UpdatePaymentStatusController {
    constructor(private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            const updatedPayment = await this.updatePaymentStatusUseCase.execute(id, estado);
            res.status(200).json(updatedPayment);
        } catch (error) {
            next(error); // Delegar el error al middleware global
        }
    }
}
