import { pool } from '../../../infrastructure/config/database';

export class EventRepository {
    // Verificar si el evento ya fue procesado
    async isEventProcessed(eventId: string): Promise<boolean> {
        const query = 'SELECT COUNT(*) AS count FROM registro_auditoria WHERE id_auditoria = ?';
        const [rows]: [any[], any] = await pool.query(query, [eventId]);
        console.log(`Verificando si el evento ${eventId} fue procesado:`, rows[0].count > 0);
        return rows[0].count > 0;
    }

    // Guardar un evento como procesado
    async saveEvent(eventId: string, eventType: string): Promise<void> {
        const query = `
            INSERT INTO registro_auditoria (id_auditoria, accion, entidad_afectada, id_entidad, descripcion)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [
            eventId,
            eventType,
            'usuarios', // Ajusta si el evento afecta a otra entidad
            null,       // Deja nulo si no hay un ID de entidad relacionado
            `Evento ${eventType} procesado con ID ${eventId}`,
        ];

        const [result]: [any, any] = await pool.query(query, values);
        console.log(`Evento ${eventId} guardado en auditoría:`, result);
    }
}
