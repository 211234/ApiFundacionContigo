import { Request, Response, NextFunction } from 'express';
import { CreateAlimentoUseCase } from '../../../../application/alimentos/use-cases/createAlimentoUseCase';
import { AuditService } from '../../../../core/users/services/auditService';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class CreateAlimentoController {
    constructor(
        private readonly createAlimentoUseCase: CreateAlimentoUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_usuario, nombre, categoria, horario } = req.body;
            const alimento = await this.createAlimentoUseCase.execute({ id_usuario, nombre, categoria, horario });

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario,
                accion: 'CREAR',
                entidad_afectada: 'alimentos',
                id_entidad: alimento.id_alimento
            });

            res.status(201).json(alimento);
        } catch (error) {
            next(error);
        }
    }
}
