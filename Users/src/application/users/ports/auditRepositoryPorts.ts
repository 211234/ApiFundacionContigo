import { RegistroAuditoria } from '../../../core/users/domain/auditEntity';

export interface AuditRepositoryPort {
    createAuditLog(auditLog: RegistroAuditoria): Promise<void>;
    getAllAuditLogs(): Promise<RegistroAuditoria[]>;
    getAuditLogById(id_auditoria: string): Promise<RegistroAuditoria | null>;
}
