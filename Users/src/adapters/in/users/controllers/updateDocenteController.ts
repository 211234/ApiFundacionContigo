import { Request, Response, NextFunction } from 'express';
import { UpdateDocenteUseCase } from '../../../../application/users/use-cases/updateDocenteUseCase';
import { UpdateDocenteDTO } from '../dtos/updateDocenteDto';

export class UpdateDocenteController {
    constructor(private readonly updateDocenteUseCase: UpdateDocenteUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_docente } = req.params;
            const updatedData = req.body;
            const updatedDocente = await this.updateDocenteUseCase.execute(id_docente, updatedData);
            res.status(200).json(updatedDocente);
        } catch (error) {
            next(error);
        }
    }
}
