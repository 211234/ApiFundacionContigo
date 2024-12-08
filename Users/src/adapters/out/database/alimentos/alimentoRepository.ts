import { pool } from '../../../../infrastructure/config/database';
import { Alimento } from '../../../../core/alimentos/domain/alimentoEntity';
import { AlimentoRepositoryPort } from '../../../../application/alimentos/ports/alimentoRepositoryPort';

export class AlimentoRepository implements AlimentoRepositoryPort {
    async createAlimento(alimento: Alimento): Promise<Alimento> {
        const query = `
            INSERT INTO alimentos (id_alimento, id_usuario, nombre, categoria, horario)
            VALUES (?, ?, ?, ?, ?)
        `;
        await pool.execute(query, [
            alimento.id_alimento, 
            alimento.id_usuario, 
            alimento.nombre, 
            alimento.categoria, 
            alimento.horario
        ]);
        return alimento;
    }

    async getAlimentosByUserId(id_usuario: string): Promise<Alimento[]> {
        const query = `SELECT * FROM alimentos WHERE id_usuario = ?`;
        const [rows]: [any[], any] = await pool.execute(query, [id_usuario]);
        return rows.map(row => new Alimento(
            row.id_alimento,
            row.id_usuario,
            row.nombre,
            row.categoria,
            row.horario
        ));
    }

    async updateAlimento(id_alimento: string, alimento: Alimento): Promise<void> {
        const query = `
            UPDATE alimentos
            SET nombre = ?, categoria = ?, horario = ?
            WHERE id_alimento = ?
        `;
        await pool.execute(query, [
            alimento.nombre,
            alimento.categoria,
            alimento.horario,
            id_alimento
        ]);
    }

    async deleteAlimento(id_alimento: string): Promise<void> {
        const query = `DELETE FROM alimentos WHERE id_alimento = ?`;
        await pool.execute(query, [id_alimento]);
    }
}
