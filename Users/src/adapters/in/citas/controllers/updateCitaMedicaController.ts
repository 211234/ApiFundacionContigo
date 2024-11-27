import { Request, Response, NextFunction } from 'express';
import { UpdateCitaMedicaUseCase } from '../../../../application/citas/use-case/updateCitaMedicaUseCase';
import { AuditService } from '../../../../core/users/services/auditService';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class UpdateCitaMedicaController {
    constructor(
        private readonly updateCitaMedicaUseCase: UpdateCitaMedicaUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_cita } = req.params;
            const { id_usuario, fecha_cita, observaciones, recordatorio } = req.body;

            // Actualizar la cita médica
            await this.updateCitaMedicaUseCase.execute({
                id_cita,
                id_usuario,
                fecha_cita,
                observaciones,
                recordatorio,
            });

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: id_usuario,
                accion: 'ACTUALIZAR',
                entidad_afectada: 'citas_medicas',
                id_entidad: id_cita
            });

            res.status(201).json({ message: 'Cita médica actualizada', fecha_cita, observaciones, recordatorio });
        } catch (error) {
            next(error);
        }
    }
}
