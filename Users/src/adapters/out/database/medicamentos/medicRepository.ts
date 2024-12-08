import { pool } from '../../../../infrastructure/config/database'; // Importa pool desde la configuración
import { CreateMedicamentoDTO } from '../../../in/medicamentos/dtos/createMedicamentoDto';
import { Medicamento } from '../../../../core/medicamentos/domain/medicamentoEntity';
import { MedicamentoRepositoryPort } from '../../../../application/medicamentos/ports/medicamentoRepositoryPort';

export class MedicamentoRepository implements MedicamentoRepositoryPort {

    // Uso de pool directamente sin definir en el constructor
    async create(medicamento: Medicamento): Promise<Medicamento> {
        const { id_medicamento, id_usuario, nombre, tipo, dosis, frecuencia, descripcion } = medicamento;

        await pool.execute(
            `INSERT INTO medicamentos (id_medicamento, id_usuario, nombre, tipo, dosis, frecuencia, descripcion) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_medicamento, id_usuario, nombre, tipo, dosis, frecuencia, descripcion]
        );

        return medicamento;
    }

    async getAll(): Promise<Medicamento[]> {
        const [rows] = await pool.query(
            `SELECT * FROM medicamentos`
        );
        return rows as Medicamento[];
    }

    async findById(id: string): Promise<Medicamento | null> {
        const [rows] = await pool.query(  // Usa pool aquí también
            `SELECT * FROM medicamentos WHERE id_medicamento = ?`,
            [id]
        );
        const medicamento = (rows as Medicamento[])[0];
        return medicamento || null;
    }

    async update(id: string, medicamentoData: Partial<CreateMedicamentoDTO>): Promise<Medicamento | null> {
        const fields = [];
        const values: any[] = [];

        for (const [key, value] of Object.entries(medicamentoData)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
        values.push(id);

        const [result] = await pool.execute(  // Uso de pool nuevamente
            `UPDATE medicamentos SET ${fields.join(', ')} WHERE id_medicamento = ?`,
            values
        );

        if ((result as any).affectedRows === 0) return null;
        return this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const [result] = await pool.execute(
            `DELETE FROM medicamentos WHERE id_medicamento = ?`,
            [id]
        );
        return (result as any).affectedRows > 0;
    }
}
