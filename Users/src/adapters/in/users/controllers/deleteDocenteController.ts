import { Request, Response, NextFunction } from 'express';
import { DeleteDocenteUseCase } from '../../../../application/users/use-cases/deleteDocenteUseCase';

export class DeleteDocenteController {
    constructor(private readonly deleteDocenteUseCase: DeleteDocenteUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_docente } = req.params;
            await this.deleteDocenteUseCase.execute(id_docente);
            res.status(200).send('Docente eliminado con éxito');
        } catch (error) {
            next(error);
        }
    }
}
