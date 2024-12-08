import { Request, Response, NextFunction } from 'express';
import { MedicamentoService } from '../../../../core/medicamentos/services/medicamentoService';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';


export class DeleteMedicamentoController {
    constructor(
        private medicamentoService: MedicamentoService,
        private auditService: AuditService
    ) {}

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.medicamentoService.deleteMedicamento(id);

            if (!deleted) {
                res.status(404).json({ message: 'Medicamento not found' });
                return;
            }

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: req.user?.id_usuario || 'Sistema',
                accion: 'BORRAR',
                entidad_afectada: 'medicamentos',
                id_entidad: id
            });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
