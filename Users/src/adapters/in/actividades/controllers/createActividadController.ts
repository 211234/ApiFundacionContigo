import { Request, Response, NextFunction } from 'express';
import { CreateActividadUseCase } from '../../../../application/actividades/use-case/createActividadUseCase';

export class CreateActividadController {
    constructor(private readonly createActividadUseCase: CreateActividadUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_docente, nombre, instrucciones, multimedia_url } = req.body;
            const actividad = await this.createActividadUseCase.execute({ id_docente, nombre, instrucciones, multimedia_url });
            res.status(201).json(actividad);
        } catch (error) {
            next(error);
        }
    }
}
