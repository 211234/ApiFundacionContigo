import { Request, Response, NextFunction } from 'express';
import { CreateCitaMedicaUseCase } from '../../../../application/citas/use-case/createCitaMedicaUseCase';
import { AuditService } from '../../../../core/users/services/auditService';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class CreateCitaMedicaController {
    constructor(
        private readonly createCitaMedicaUseCase: CreateCitaMedicaUseCase,
        private readonly auditService: AuditService
    ) {}

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_usuario, fecha_cita, observaciones, recordatorio } = req.body;

            // Crear la cita médica
            const cita = await this.createCitaMedicaUseCase.execute({ id_usuario, fecha_cita, observaciones, recordatorio });

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: id_usuario,
                accion: 'CREAR',
                entidad_afectada: 'citas_medicas',
                id_entidad: cita.id_cita
            });

            res.status(201).json(cita);
        } catch (error) {
            next(error);
        }
    }
}
