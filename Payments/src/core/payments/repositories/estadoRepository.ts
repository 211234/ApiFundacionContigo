import { Pool } from 'pg';
import { EstadoRepositoryPort } from '../../../application/payments/ports/estadoRepositoryPort';
import { Estado } from '../domain/estado';

export class EstadosRepository implements EstadoRepositoryPort {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });
    }

    /**
     * Encuentra un estado por su nombre.
     * @param estado - Nombre del estado
     * @returns El estado encontrado o null si no existe.
     */
    async findByEstado(estado: string): Promise<Estado | null> {
        const query = `SELECT * FROM estados WHERE estado = $1 LIMIT 1;`;
        const result = await this.pool.query(query, [estado]);

        if (result.rows.length === 0) {
            return null; // Si no se encuentra el estado
        }

        const estadoDb = result.rows[0];
        return {
            id: estadoDb.id,
            estado: estadoDb.estado,
        }; // Regresamos el estado encontrado
    }
}
