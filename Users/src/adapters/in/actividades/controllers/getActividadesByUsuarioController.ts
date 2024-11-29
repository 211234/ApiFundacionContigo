import { Request, Response, NextFunction } from 'express';
import { GetActividadesByUsuarioUseCase } from '../../../../application/actividades/use-case/getActividadesByUsuarioUseCase';

export class GetActividadesByUsuarioController {
    constructor(private readonly getActividadesByUsuarioUseCase: GetActividadesByUsuarioUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_usuario } = req.params;
            const actividades = await this.getActividadesByUsuarioUseCase.execute(id_usuario);
            res.json(actividades);
        } catch (error) {
            next(error);
        }
    }
}
