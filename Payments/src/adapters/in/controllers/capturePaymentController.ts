import { Request, Response, NextFunction } from 'express';
import { CapturePaymentUseCase } from '../../../application/payments/use-case/capturePaymentUseCase';

export class CapturePaymentController {
    private capturePaymentUseCase: CapturePaymentUseCase;

    constructor(capturePaymentUseCase: CapturePaymentUseCase) {
        this.capturePaymentUseCase = capturePaymentUseCase;
    }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { orderId } = req.params;

        try {
            const result = await this.capturePaymentUseCase.execute(orderId);
            res.status(200).json(result);
        } catch (error) {
            next(error); // Delegar el error al middleware global
        }
    }
}
