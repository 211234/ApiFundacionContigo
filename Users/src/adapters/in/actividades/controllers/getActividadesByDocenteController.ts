import { Request, Response, NextFunction } from 'express';
import { GetActividadesByDocenteUseCase } from '../../../../application/actividades/use-case/getActividadesByDocenteUseCase';

export class GetActividadesByDocenteController {
    constructor(private readonly getActividadesByDocenteUseCase: GetActividadesByDocenteUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_docente } = req.params;
            const actividades = await this.getActividadesByDocenteUseCase.execute(id_docente);
            res.json(actividades);
        } catch (error) {
            next(error);
        }
    }
}
