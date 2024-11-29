import { Request, Response, NextFunction } from 'express';
import { DeleteAlimentoUseCase } from '../../../../application/alimentos/use-cases/deleteAlimentoUseCase';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';

export class DeleteAlimentoController {
    constructor(
        private readonly deleteAlimentoUseCase: DeleteAlimentoUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_alimento } = req.params;
            
            await this.deleteAlimentoUseCase.execute(id_alimento);

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
