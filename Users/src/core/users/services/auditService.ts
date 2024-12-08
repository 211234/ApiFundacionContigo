import { AuditRepository } from '../repositories/auditRepository';
import { RegistroAuditoria } from '../domain/auditEntity';
import { v4 as uuidv4 } from 'uuid';

interface AuditData {
    id_usuario: string;
    accion: 'CREAR' | 'ACTUALIZAR' | 'BORRAR' | 'LOGIN' | 'LOGOUT' | 'ACTUALIZAR_ESTADO_VERIFICACION' | 'CREAR_HISTORIAL' | 'CONSULTAR';
    entidad_afectada: 'usuarios' | 'hijos' | 'docentes' | 'medicamentos' | 'citas_medicas' | 'alimentos' | 'actividades' | 'hilos_chat' | 'mensajes_chat';
    id_entidad: string;
}

export class AuditService {
    constructor(private auditRepository: AuditRepository) { }

    async createAuditLog(data: AuditData) {
        try {
            const descripcion = this.generateDescription(data.accion, data.entidad_afectada, data.id_entidad);
            const audit = new RegistroAuditoria(
                uuidv4(),
                data.id_usuario,
                data.accion,
                data.entidad_afectada,
                data.id_entidad,
                new Date(),
                descripcion
            );

            console.log("Attempting to create audit log with data:", audit);
            await this.auditRepository.createAuditLog(audit);
            console.log("Audit log successfully created in database for:", audit.id_auditoria);
        } catch (error) {
            console.error("Error during audit log creation in AuditService:", error);
            throw error;
        }
    }

    async getAllAuditLogs(): Promise<RegistroAuditoria[]> {
        return await this.auditRepository.getAllAuditLogs();
    }

    async getAuditLogById(id_auditoria: string): Promise<RegistroAuditoria | null> {
        return await this.auditRepository.getAuditLogById(id_auditoria);
    }

    private generateDescription(accion: string, entidad: string, idEntidad: string): string {
        switch (accion) {
            case 'CREAR': return `Registro creado en ${entidad} con ID ${idEntidad}`;
            case 'ACTUALIZAR': return `Registro actualizado en ${entidad} con ID ${idEntidad}`;
            case 'BORRAR': return `Registro borrado en ${entidad} con ID ${idEntidad}`;
            case 'LOGIN': return `Usuario con ID ${idEntidad} inició sesión`;
            case 'LOGOUT': return `Usuario con ID ${idEntidad} cerró sesión`;
            case 'ACTUALIZAR_ESTADO_VERIFICACION': return `Estado de verificación actualizado para ${entidad} con ID ${idEntidad}`;
            case 'CREAR_HISTORIAL': return `Historial creado para ${entidad} con ID ${idEntidad}`;
            case 'CONSULTAR': return `Consulta realizada en ${entidad} con ID ${idEntidad}`;
            default: return `Acción desconocida en ${entidad} con ID ${idEntidad}`;
        }
    }    
}
