import { Request, Response, NextFunction } from 'express';
import { AssignActividadUseCase } from '../../../../application/actividades/use-case/assignActividadUseCase';

export class AssignActividadController {
    constructor(private readonly assignActividadUseCase: AssignActividadUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_actividad, usuarios } = req.body; // `usuarios` es un array de IDs de usuarios
            await this.assignActividadUseCase.execute(id_actividad, usuarios);
            res.status(201).send('Actividad asignada correctamente');
        } catch (error) {
            next(error);
        }
    }
}
