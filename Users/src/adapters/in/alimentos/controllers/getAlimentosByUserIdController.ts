import { Request, Response, NextFunction } from 'express';
import { GetAlimentosByUserIdUseCase } from '../../../../application/alimentos/use-cases/getAlimentosByUserIdUseCase';
import { AuditService } from '../../../../core/users/services/auditService';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class GetAlimentosByUserIdController {
    constructor(
        private readonly getAlimentosByUserIdUseCase: GetAlimentosByUserIdUseCase,
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_usuario } = req.params;

            const alimentos = await this.getAlimentosByUserIdUseCase.execute(id_usuario);

            res.json(alimentos);
        } catch (error) {
            next(error);
        }
    }
}
