import { Request, Response, NextFunction } from 'express';
import { GetCitasByUserIdUseCase } from '../../../../application/citas/use-case/getCitasByUserIdUseCase';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class GetCitasByUserIdController {
    constructor(
        private readonly getCitasByUserIdUseCase: GetCitasByUserIdUseCase,
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_usuario } = req.params;

            // Obtener citas médicas del usuario
            const citas = await this.getCitasByUserIdUseCase.execute(id_usuario);

            res.json(citas);
        } catch (error) {
            next(error);
        }
    }
}
