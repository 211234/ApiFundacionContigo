import { Request, Response, NextFunction } from 'express';
import { DeleteAlimentoUseCase } from '../../../../application/alimentos/use-cases/deleteAlimentoUseCase';
import { AuditService } from '../../../../core/users/services/auditService';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class DeleteAlimentoController {
    constructor(
        private readonly deleteAlimentoUseCase: DeleteAlimentoUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_alimento } = req.params;

            // Eliminar el alimento
            await this.deleteAlimentoUseCase.execute(id_alimento);

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: req.user?.id_usuario || 'Sistema',
                accion: 'BORRAR',
                entidad_afectada: 'alimentos',
                id_entidad: id_alimento
            });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
