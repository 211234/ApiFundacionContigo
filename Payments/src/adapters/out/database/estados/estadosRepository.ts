// En el archivo estadoRepository.ts
import { EstadoRepositoryPort } from '../../../../application/payments/ports/estadoRepositoryPort';
import { Pool } from 'pg';
import { Estado } from './estadosEntity';

export class EstadoRepository implements EstadoRepositoryPort {
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

    async findByEstado(estado: string): Promise<Estado | null> {
        const query = `SELECT * FROM estados WHERE estado = $1 LIMIT 1;`;
        const result = await this.pool.query(query, [estado]);

        if (result.rows.length === 0) {
            return null;
        }

        return {
            id: result.rows[0].id,
            estado: result.rows[0].estado,
        };
    }
}

