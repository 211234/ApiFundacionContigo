import { EstadoActividadesRepositoryPort } from '../../../../application/actividades/ports/estadoActividadesRepositoryPort';
import { EstadoActividad } from '../../../../core/actividades/domain/estadoActividadEntity';
import { pool } from '../../../../infrastructure/config/database';

export class EstadoActividadesRepository implements EstadoActividadesRepositoryPort {
    async create(estadoActividad: EstadoActividad): Promise<void> {
        const query = `
            INSERT INTO estado_actividades (
                id_estado, id_actividad, id_usuario, evidencia_url,
                fecha_completado, tiempo_minutos, estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.execute(query, [
            estadoActividad.id_estado,
            estadoActividad.id_actividad,
            estadoActividad.id_usuario,
            estadoActividad.evidencia_url,
            estadoActividad.fecha_completado,
            estadoActividad.tiempo_minutos,
            estadoActividad.estado
        ]);
    }

    async getActividadesByUsuario(id_usuario: string): Promise<any[]> {
        const query = `
            SELECT a.*, ea.*
            FROM actividades a
            INNER JOIN estado_actividades ea ON a.id_actividad = ea.id_actividad
            WHERE ea.id_usuario = ?
        `;
        const [rows]: [any[], any] = await pool.execute(query, [id_usuario]);
        return rows;
    }

    async getUsuarioInfo(id_usuario: string): Promise<any> {
        const query = `
            SELECT nombre, correo
            FROM usuarios
            WHERE id_usuario = ?
        `;
        const [rows]: [any[], any] = await pool.execute(query, [id_usuario]);
        return rows[0] || null;
    }

    async update(id_estado: string, data: { evidencia_url: string; fecha_completado: Date; tiempo_minutos: number; estado: boolean }): Promise<void> {
        const query = `
            UPDATE estado_actividades
            SET evidencia_url = ?, fecha_completado = ?, tiempo_minutos = ?, estado = ?
            WHERE id_estado = ?
        `;
        const [result]: any = await pool.execute(query, [
            data.evidencia_url,
            data.fecha_completado,
            data.tiempo_minutos,
            data.estado,
            id_estado,
        ]);
        console.log('Resultado de la consulta de actualización:', result);
    }
}
