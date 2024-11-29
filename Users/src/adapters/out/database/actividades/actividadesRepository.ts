import { ActividadesRepositoryPort } from '../../../../application/actividades/ports/actividadesRepositoryPort';
import { Actividad } from '../../../../core/actividades/domain/actividadEntity';
import { pool } from '../../../../infrastructure/config/database';

export class ActividadesRepository implements ActividadesRepositoryPort {
    async create(actividad: Actividad): Promise<Actividad> {
        const query = `
            INSERT INTO actividades (id_actividad, id_docente, nombre, instrucciones, multimedia_url)
            VALUES (?, ?, ?, ?, ?)
        `;
        await pool.execute(query, [
            actividad.id_actividad,
            actividad.id_docente,
            actividad.nombre,
            actividad.instrucciones,
            actividad.multimedia_url
        ]);
        return actividad;
    }

    async getActividadesByDocente(id_docente: string): Promise<Actividad[]> {
        const query = `
            SELECT * FROM actividades WHERE id_docente = ?
        `;
        const [rows]: [any[], any] = await pool.execute(query, [id_docente]);
        return rows.map(row => ({
            id_actividad: row.id_actividad,
            id_docente: row.id_docente,
            nombre: row.nombre,
            instrucciones: row.instrucciones,
            multimedia_url: row.multimedia_url
        }));
    }

    async findById(id_actividad: string): Promise<Actividad> {
        const query = `
            SELECT * FROM actividades WHERE id_actividad = ?
        `;
        const [rows]: [any[], any] = await pool.execute(query, [id_actividad]);
        const row = rows[0];
        return {
            id_actividad: row.id_actividad,
            id_docente: row.id_docente,
            nombre: row.nombre,
            instrucciones: row.instrucciones,
            multimedia_url: row.multimedia_url
        };
    }
}
