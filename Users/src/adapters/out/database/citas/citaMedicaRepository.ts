import { pool } from '../../../../infrastructure/config/database';
import { CitaMedica } from '../../../../core/citas/domain/citaMedicaEntity';
import { CitaMedicaRepositoryPort } from '../../../../application/citas/ports/citaMedicaRepositoryPort';

export class CitaMedicaRepository implements CitaMedicaRepositoryPort {
    async createCita(cita: CitaMedica): Promise<CitaMedica> {
        const query = `
            INSERT INTO citas_medicas (id_cita, id_usuario, fecha_cita, observaciones, recordatorio)
            VALUES (?, ?, ?, ?, ?)
        `;
        await pool.execute(query, [cita.id_cita, cita.id_usuario, cita.fecha_cita, cita.observaciones, cita.recordatorio]);
        return cita;
    }

    async getCitasByUserId(id_usuario: string): Promise<CitaMedica[]> {
        const query = `
            SELECT * FROM citas_medicas WHERE id_usuario = ?
        `;
        const [rows]: [any[], any] = await pool.execute(query, [id_usuario]);
        return rows.map(row => ({
            id_cita: row.id_cita,
            id_usuario: row.id_usuario,
            fecha_cita: row.fecha_cita,
            observaciones: row.observaciones,
            recordatorio: row.recordatorio
        }));
    }

    async updateCita(cita: CitaMedica): Promise<void> {
        const query = `
            UPDATE citas_medicas
            SET fecha_cita = ?, observaciones = ?, recordatorio = ?
            WHERE id_cita = ?
        `;
        await pool.execute(query, [cita.fecha_cita, cita.observaciones, cita.recordatorio, cita.id_cita]);
    }

    async deleteCita(id_cita: string): Promise<void> {
        const query = `DELETE FROM citas_medicas WHERE id_cita = ?`;
        await pool.execute(query, [id_cita]);
    }
}
