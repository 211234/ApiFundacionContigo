import { LeadRepositoryPort } from '../../../../application/lead/ports/leadRepositoryPort';
import { pool } from '../../../../infrastructure/config/database';
import { Lead } from '../../../../core/lead/domain/lead';
import { FieldPacket, RowDataPacket } from 'mysql2';

export class LeadRepository {
    async create(lead: Lead): Promise<void> {
        const query = `
      INSERT INTO leads (id_lead, nombre, correo, telefono, estado)
      VALUES (?, ?, ?, ?, 'pendiente');
    `;
        await pool.execute(query, [lead.id_lead, lead.nombre, lead.correo, lead.telefono]);
    }

    async deleteByEmail(correo: string): Promise<void> {
        const query = `DELETE FROM leads WHERE correo = ?;`;
        await pool.execute(query, [correo]);
    }

    async confirmLead(id_lead: string): Promise<void> {
        const query = `
      UPDATE leads
      SET estado = 'confirmado', id_usuario = ?
      WHERE id_lead = ?;
    `;
        await pool.execute(query, [id_lead, id_lead]);
    }

    async rejectLead(id_lead: string): Promise<void> {
        const query = `
      UPDATE leads
      SET estado = 'rechazado'
      WHERE id_lead = ?;
    `;
        await pool.execute(query, [id_lead]);
    }

    async getPendingLeads(): Promise<Lead[]> {
        const query = `SELECT * FROM leads WHERE estado = 'pendiente';`;
        const [rows] = await pool.query(query);
        return rows as Lead[];
    }

    async findById(id_lead: string): Promise<Lead | null> {
        const query = `SELECT * FROM leads WHERE id_lead = ?;`;
        const [rows] = await pool.query(query, [id_lead]);
        const lead = (rows as Lead[])[0];
        return lead || null;
    }

    async confirmUser(userId: string): Promise<{ id_usuario: string; nombre: string; correo: string } | null> {
        const query = 'SELECT id_usuario, nombre, correo FROM usuarios WHERE id_usuario = ?';
        const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(query, [userId]);

        if (rows.length > 0) {
            const user = rows[0] as { id_usuario: string; nombre: string; correo: string };
            return user;
        }
        return null;
    }
}