import { pool } from '../../../../infrastructure/config/database';
import { RegistroAuditoria } from '../../../../core/users/domain/auditEntity';
import { AuditRepositoryPort } from '../../../../application/users/ports/auditRepositoryPorts';

export class AuditRepository {
    constructor(private db = pool) {}

    async createAuditLog(auditLog: RegistroAuditoria): Promise<void> {
        const query = `
            INSERT INTO registro_auditoria (id_auditoria, id_usuario, accion, entidad_afectada, id_entidad, descripcion, fecha)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            auditLog.id_auditoria,
            auditLog.id_usuario,
            auditLog.accion,
            auditLog.entidad_afectada,
            auditLog.id_entidad,
            auditLog.descripcion,
            auditLog.fecha_accion,
        ];

        const connection = await this.db.getConnection();
        try {
            await connection.query(query, values);
        } catch (error) {
            console.error("Error creating audit log:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async getAllAuditLogs(): Promise<RegistroAuditoria[]> {
        const query = `
            SELECT id_auditoria, id_usuario, accion, entidad_afectada, id_entidad, descripcion, fecha
            FROM registro_auditoria
        `;

        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query(query);
            return (rows as any[]).map(row => ({
                id_auditoria: row.id_auditoria,
                id_usuario: row.id_usuario,
                accion: row.accion,
                entidad_afectada: row.entidad_afectada,
                id_entidad: row.id_entidad,
                descripcion: row.descripcion,
                fecha_accion: row.fecha,
            }));
        } catch (error) {
            console.error("Error fetching all audit logs:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async getAuditLogById(id_auditoria: string): Promise<RegistroAuditoria | null> {
        const query = `
            SELECT id_auditoria, id_usuario, accion, entidad_afectada, id_entidad, descripcion, fecha
            FROM registro_auditoria
            WHERE id_auditoria = ?
        `;

        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.query(query, [id_auditoria]);

            if ((rows as any[]).length === 0) {
                return null;
            }

            const row = (rows as any[])[0];
            return {
                id_auditoria: row.id_auditoria,
                id_usuario: row.id_usuario,
                accion: row.accion,
                entidad_afectada: row.entidad_afectada,
                id_entidad: row.id_entidad,
                descripcion: row.descripcion,
                fecha_accion: row.fecha,
            };
        } catch (error) {
            console.error(`Error fetching audit log with ID ${id_auditoria}:`, error);
            throw error;
        } finally {
            connection.release();
        }
    }
}
