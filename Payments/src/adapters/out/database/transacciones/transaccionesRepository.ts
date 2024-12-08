import { Pool } from 'pg';
import { Transaccion } from './transaccionesEntity';

export class TransaccionesRepository {
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

    // Ajustamos el método create para aceptar los parámetros que realmente guardamos en la base de datos
    async create(data: {
        id: string;
        id_usuario: string;
        paypal_order_id: string;
        total: number;
        estado_id: number;
        metadata: object;
        created_at?: Date; // Hacer estas propiedades opcionales
        updated_at?: Date;
    }): Promise<Transaccion> {
        const query = `
            INSERT INTO transacciones (id, id_usuario, paypal_order_id, total, estado_id, metadata, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            data.id,
            data.id_usuario,
            data.paypal_order_id,
            data.total,
            data.estado_id,
            JSON.stringify(data.metadata),
            new Date(),
            new Date(),
        ];
    
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async findById(id: string): Promise<Transaccion | null> {
        const query = `SELECT * FROM transacciones WHERE id = $1;`;
        const result = await this.pool.query(query, [id]);

        if (result.rows.length === 0) return null;

        return result.rows[0];
    }

    async findByPaypalOrderId(paypalOrderId: string): Promise<Transaccion | null> {
        const query = `SELECT * FROM transacciones WHERE paypal_order_id = $1;`;
        const result = await this.pool.query(query, [paypalOrderId]);

        if (result.rows.length === 0) return null;

        return result.rows[0];
    }

    async updateStatus(paypalOrderId: string, estado_id: number): Promise<Transaccion> {
        const query = `
            UPDATE transacciones
            SET estado_id = $1, updated_at = NOW()
            WHERE paypal_order_id = $2
            RETURNING *;
        `;
        const values = [estado_id, paypalOrderId];
        const result = await this.pool.query(query, values);

        if (result.rows.length === 0) throw new Error('Transacción no encontrada');

        return result.rows[0];
    }

    async publishEvent(event: string, data: any): Promise<void> {
        // Implementa la publicación de eventos aquí
        console.log(`Publicando evento ${event} con datos:`, data);
    }
}

