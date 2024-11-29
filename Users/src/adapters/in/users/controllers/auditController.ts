import { Request, Response } from 'express';
import { AuditService } from '../../../../core/users/services/auditService';
import { AuditLogDTO } from '../../../../adapters/in/users/dtos/auditLogDto';
import { AuthRequest } from '../../../../interfaces/authRequest';

export class AuditController {
    constructor(private auditService: AuditService) {}

    async getAuditLogs(req: AuthRequest, res: Response) {
        try {
            const logs = await this.auditService.getAllAuditLogs();
            const logsDTO: AuditLogDTO[] = logs.map(log => ({
                id_auditoria: log.id_auditoria,
                id_usuario: log.id_usuario,
                accion: log.accion,
                entidad_afectada: log.entidad_afectada,
                id_entidad: log.id_entidad,
                descripcion: log.descripcion,
                fecha_accion: log.fecha_accion,
            }));
            res.json(logsDTO);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los registros de auditoría' });
        }
    }

    async getAuditLogById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const log = await this.auditService.getAuditLogById(id);
            if (!log) {
                res.status(404).json({ message: 'Registro de auditoría no encontrado' });
            } else {
                const logDTO: AuditLogDTO = {
                    id_auditoria: log.id_auditoria,
                    id_usuario: log.id_usuario,
                    accion: log.accion,
                    entidad_afectada: log.entidad_afectada,
                    id_entidad: log.id_entidad,
                    descripcion: log.descripcion,
                    fecha_accion: log.fecha_accion,
                };
                res.json(logDTO);
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el registro de auditoría' });
        }
    }
}
