import { Request, Response, NextFunction } from 'express';
import { ConfirmLeadUseCase } from '../../../../application/lead/use-cases/confirmLeadUseCase';

export class ConfirmLeadController {
    constructor(private confirmLeadUseCase: ConfirmLeadUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_lead } = req.body;
            await this.confirmLeadUseCase.execute(id_lead);
            res.status(200).json({ message: 'Lead confirmado exitosamente.' });
        } catch (error) {
            next(error);
        }
    }
}