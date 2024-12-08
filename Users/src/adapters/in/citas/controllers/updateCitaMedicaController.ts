import { Request, Response, NextFunction } from 'express';
import { UpdateCitaMedicaUseCase } from '../../../../application/citas/use-case/updateCitaMedicaUseCase';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';


export class UpdateCitaMedicaController {
    constructor(
        private readonly updateCitaMedicaUseCase: UpdateCitaMedicaUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_cita } = req.params;
            const { id_usuario, fecha_cita, observaciones, recordatorio } = req.body;

            await this.updateCitaMedicaUseCase.execute({
                id_cita,
                id_usuario,
                fecha_cita,
                observaciones,
                recordatorio,
            });

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
