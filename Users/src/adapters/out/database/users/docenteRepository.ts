import { DocenteRepositoryPort } from '../../../../application/users/ports/docenteRepositoryPort';
import { Docente } from '../../../../core/users/domain/docenteEntity';
import { pool } from '../../../../infrastructure/config/database';

export class DocenteRepository implements DocenteRepositoryPort {
    async findByMateria(materia: string): Promise<Docente | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM docentes WHERE materia = ?', [materia]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createDocente(docente: Docente): Promise<any> {
        await pool.query(
            'INSERT INTO docentes (id_docente, id_usuario, materia, direccion) VALUES (?, ?, ?, ?)',
            [docente.id_docente, docente.id_usuario, docente.materia, docente.direccion]
        );

        // Obtén todos los datos, combinando `docentes` y `usuarios`
        return await this.findById(docente.id_docente);
    }

    async findById(id_docente: string): Promise<any> {
        const [rows]: [any[], any] = await pool.query(`
            SELECT u.id_usuario, u.nombre, u.correo, u.password, u.telefono, d.materia, d.direccion
            FROM docentes d
            INNER JOIN usuarios u ON d.id_usuario = u.id_usuario
            WHERE d.id_docente = ?
        `, [id_docente]);

        return rows.length > 0 ? rows[0] : null;
    }

    async update(id_docente: string, updatedData: any): Promise<Docente | null> {
        await pool.query(
            'UPDATE docentes SET materia = ?, direccion = ? WHERE id_docente = ?',
            [updatedData.materia, updatedData.direccion, id_docente]
        );
        return this.findById(id_docente);
    }

    async getAllDocentes(): Promise<Docente[]> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM docentes');
        return rows as Docente[];
    }

    async delete(id_docente: string): Promise<void> {
        const [result]: any = await pool.query('DELETE FROM docentes WHERE id_docente = ?', [id_docente]);
        if (result.affectedRows === 0) {
            throw new Error('Docente no encontrado o ya eliminado');
        }
    }
}
