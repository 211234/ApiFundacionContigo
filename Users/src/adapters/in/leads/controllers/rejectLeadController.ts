import { Request, Response, NextFunction } from 'express';
import { RejectLeadUseCase } from '../../../../application/lead/use-cases/rejectLeadUseCase';

export class RejectLeadController {
    constructor(private rejectLeadUseCase: RejectLeadUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_lead } = req.body;
            await this.rejectLeadUseCase.execute(id_lead);
            res.status(200).json({ message: 'Lead rechazado exitosamente.' });
        } catch (error) {
           next(error);
        }
    }
}
