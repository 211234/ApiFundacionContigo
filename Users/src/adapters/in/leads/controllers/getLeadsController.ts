import { Request, Response, NextFunction } from 'express';
import { GetLeadsUseCase } from '../../../../application/lead/use-cases/getLeadsUseCase';

export class GetLeadsController {
    constructor(private getLeadsUseCase: GetLeadsUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void>  {
        try {
            const leads = await this.getLeadsUseCase.execute();
            res.status(200).json(leads);
        } catch (error) {
            next(error);
        }
    }
}
