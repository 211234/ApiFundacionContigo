import { Request, Response, NextFunction } from 'express';
import { GetAllDocentesUseCase } from '../../../../application/users/use-cases/getAllDocentesUseCase';

export class GetAllDocentesController {
    constructor(private readonly getAllDocentesUseCase: GetAllDocentesUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const docentes = await this.getAllDocentesUseCase.execute();
            res.status(200).json(docentes);
        } catch (error) {
            next(error);
        }
    }
}
