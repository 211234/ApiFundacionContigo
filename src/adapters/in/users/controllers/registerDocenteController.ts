import { Request, Response, NextFunction } from 'express';
import { RegisterDocenteUseCase } from '../../../../application/users/use-cases/registerDocenteUseCase';
import { RegisterDocenteDTO } from '../dtos/registerDocenteDto';

export class RegisterDocenteController {
    constructor(private registerDocenteUseCase: RegisterDocenteUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        

        try {
            const docenteDTO: RegisterDocenteDTO = req.body;
            const docente = await this.registerDocenteUseCase.execute(docenteDTO);
            res.status(201).json({ docente });
        } catch (error) {
            next(error);
        }
    }
}
