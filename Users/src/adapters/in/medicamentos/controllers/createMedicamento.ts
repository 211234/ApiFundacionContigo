import { Request, Response, NextFunction } from 'express';
import { MedicamentoService } from '../../../../core/medicamentos/services/medicamentoService';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';


export class CreateMedicamentoController {
    constructor(
        private medicamentoService: MedicamentoService,
        private auditService: AuditService
    ) {}

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const medicamento = await this.medicamentoService.createMedicamento(req.body);

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: req.user?.id_usuario || 'Sistema',
                accion: 'CREAR',
                entidad_afectada: 'medicamentos',
                id_entidad: medicamento.id_medicamento
            });

            res.status(201).json(medicamento);
        } catch (error) {
            next(error);
        }
    }
}
