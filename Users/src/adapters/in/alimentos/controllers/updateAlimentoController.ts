import { Request, Response, NextFunction } from 'express';
import { UpdateAlimentoUseCase } from '../../../../application/alimentos/use-cases/updateAlimentoUseCase';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuthRequest } from '../../../../interfaces/authRequest';

export class UpdateAlimentoController {
    constructor(
        private readonly updateAlimentoUseCase: UpdateAlimentoUseCase,
        private readonly auditService: AuditService
    ) { }

    async handle(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id_alimento } = req.params;
            const { id_usuario, nombre, categoria, horario } = req.body;

            await this.updateAlimentoUseCase.execute(id_alimento, { id_alimento, id_usuario, nombre, categoria, horario });

            await this.auditService.createAuditLog({
                id_usuario: id_usuario,
                accion: 'ACTUALIZAR',
                entidad_afectada: 'alimentos',
                id_entidad: id_alimento
            });

            res.status(201).send({ message: 'Alimento actualizada', id_alimento, id_usuario, nombre, categoria, horario });
        } catch (error) {
            next(error);
        }
    }
}
