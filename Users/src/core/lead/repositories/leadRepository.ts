import { Lead } from '../domain/lead';
import { LeadRepositoryPort } from '../../../application/lead/ports/leadRepositoryPort';
import { pool } from '../../../infrastructure/config/database';

export class LeadRepositoryImpl implements LeadRepositoryPort {
    // Crear un lead
    async create(lead: Lead): Promise<void> {
        const query = `
            INSERT INTO leads (id_lead, nombre, correo, telefono, estado, fecha_creacion)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            lead.id_lead,
            lead.nombre,
            lead.correo,
            lead.telefono,
            lead.estado,
            lead.fecha_creacion
        ];

        await pool.execute(query, params);
    }

    // Buscar lead por ID
    async findById(id_lead: string): Promise<Lead | null> {
        const query = `SELECT * FROM leads WHERE id_lead = ?`;
        const [rows]: any = await pool.execute(query, [id_lead]);

        if (rows.length === 0) return null;

        const lead = rows[0];
        return {
            id_lead: lead.id_lead,
            nombre: lead.nombre,
            correo: lead.correo,
            telefono: lead.telefono,
            estado: lead.estado,
            fecha_creacion: new Date(lead.fecha_creacion)
        };
    }

    // Obtener todos los leads pendientes
    async getPendingLeads(): Promise<Lead[]> {
        const query = `SELECT * FROM leads WHERE estado = 'pendiente'`;
        const [rows]: any = await pool.execute(query);

        return rows.map((lead: any) => ({
            id: lead.id_lead,
            nombre: lead.nombre,
            correo: lead.correo,
            telefono: lead.telefono,
            estado: lead.estado,
            fechaCreacion: new Date(lead.fecha_creacion)
        }));
    }

    // Confirmar lead y asociarlo con un usuario
    async confirmLead(id_lead: string,): Promise<void> {
        const query = `
            UPDATE leads
            SET estado = 'confirmado',
            WHERE id_lead = ? AND estado = 'pendiente'
        `;
        const [result]: any = await pool.execute(query, [id_lead]);

        if (result.affectedRows === 0) {
            throw new Error('El lead no existe o ya ha sido procesado.');
        }
    }

    async deleteByEmail(correo: string): Promise<void> {
        const query = `DELETE FROM leads WHERE correo = ?`;
        await pool.execute(query, [correo]);
    }

    // Rechazar lead
    async rejectLead(id_lead: string): Promise<void> {
        const query = `
            UPDATE leads
            SET estado = 'rechazado'
            WHERE id_lead = ? AND estado = 'pendiente'
        `;
        const [result]: any = await pool.execute(query, [id_lead]);

        if (result.affectedRows === 0) {
            throw new Error('El lead no existe o ya ha sido procesado.');
        }
    }
}
