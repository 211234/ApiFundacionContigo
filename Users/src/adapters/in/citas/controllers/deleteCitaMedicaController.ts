import { Request, Response, NextFunction } from 'express';
import { DeleteCitaMedicaUseCase } from '../../../../application/citas/use-case/deleteCitaMedicaUseCase';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';


export class DeleteCitaMedicaController {
    constructor(
        private readonly deleteCitaMedicaUseCase: DeleteCitaMedicaUseCase,
        private readonly auditService: AuditService
    ) {}

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_cita } = req.params;

            await this.deleteCitaMedicaUseCase.execute(id_cita);

            await this.auditService.createAuditLog({
                id_usuario: req.user?.id_usuario || 'Sistema',
                accion: 'BORRAR',
                entidad_afectada: 'citas_medicas',
                id_entidad: id_cita
            });

            res.status(204).send('Cita médica eliminada');
        } catch (error) {
            next(error);
        }
    }
}
