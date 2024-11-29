import { Request, Response, NextFunction } from 'express';
import { MedicamentoService } from '../../../../core/medicamentos/services/medicamentoService';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';


export class UpdateMedicamentoController {
    constructor(
        private medicamentoService: MedicamentoService,
        private auditService: AuditService
    ) {}

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const medicamentoData = req.body;
            const updatedMedicamento = await this.medicamentoService.updateMedicamento(id, medicamentoData);

            if (!updatedMedicamento) {
                res.status(404).json({ message: 'Medicamento not found' });
                return;
            }

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: req.user?.id_usuario || 'Sistema',
                accion: 'ACTUALIZAR',
                entidad_afectada: 'medicamentos',
                id_entidad: id
            });

            res.status(200).json(updatedMedicamento);
        } catch (error) {
            next(error);
        }
    }
}
