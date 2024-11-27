import { Request, Response, NextFunction } from 'express';
import { GetCitasByUserIdUseCase } from '../../../../application/citas/use-case/getCitasByUserIdUseCase';
import { AuditService } from '../../../../core/users/services/auditService';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

export class GetCitasByUserIdController {
    constructor(
        private readonly getCitasByUserIdUseCase: GetCitasByUserIdUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_usuario } = req.params;

            // Obtener citas médicas del usuario
            const citas = await this.getCitasByUserIdUseCase.execute(id_usuario);

            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: id_usuario,
                accion: 'CONSULTAR',
                entidad_afectada: 'citas_medicas',
                id_entidad: id_usuario
            });

            res.json(citas);
        } catch (error) {
            next(error);
        }
    }
}
