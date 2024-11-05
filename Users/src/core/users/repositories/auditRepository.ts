import { RegistroAuditoria } from "../domain/auditEntity";
import { pool } from "../../../infrastructure/config/database";

export class AuditRepository {
    public async createAuditLog(audit: RegistroAuditoria): Promise<void> {
        const query = `INSERT INTO registro_auditoria 
        (id_auditoria, id_usuario, accion, entidad_afectada, id_entidad, fecha_accion, descripcion) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

        console.log("Executing query for createAuditLog with data:", audit);

        const connection = await pool.getConnection();
        try {
            await connection.query(query, [
                audit.id_auditoria,
                audit.id_usuario,
                audit.accion,
                audit.entidad_afectada,
                audit.id_entidad,
                audit.fecha_accion,
                audit.descripcion
            ]);
            console.log("Audit log inserted successfully with ID:", audit.id_auditoria);
        } catch (error) {
            console.error("Error inserting audit log into the database:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    public async getAllAuditLogs(): Promise<RegistroAuditoria[]> {
        const query = `SELECT id_auditoria, id_usuario, accion, entidad_afectada, id_entidad, fecha_accion, descripcion 
                       FROM registro_auditoria`;
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(query);
            return (rows as any[]).map(row => ({
                id_auditoria: row.id_auditoria,
                id_usuario: row.id_usuario,
                accion: row.accion,
                entidad_afectada: row.entidad_afectada,
                id_entidad: row.id_entidad,
                fecha_accion: row.fecha_accion,
                descripcion: row.descripcion,
            }));
        } catch (error) {
            console.error("Error fetching all audit logs:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    public async getAuditLogById(id_auditoria: string): Promise<RegistroAuditoria | null> {
        const query = `SELECT id_auditoria, id_usuario, accion, entidad_afectada, id_entidad, fecha_accion, descripcion 
                       FROM registro_auditoria 
                       WHERE id_auditoria = ?`;

        const [rows]: [any[], any] = await pool.query(query, [id_auditoria]);
        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        return {
            id_auditoria: row.id_auditoria,
            id_usuario: row.id_usuario,
            accion: row.accion,
            entidad_afectada: row.entidad_afectada,
            id_entidad: row.id_entidad,
            fecha_accion: row.fecha_accion,
            descripcion: row.descripcion,
        };
    }
}
