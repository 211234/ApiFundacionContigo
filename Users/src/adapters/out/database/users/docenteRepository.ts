import { DocenteRepositoryPort } from '../../../../application/users/ports/docenteRepositoryPort';
import { Docente } from '../../../../core/users/domain/docenteEntity';
import { pool } from '../../../../infrastructure/config/database';

export class DocenteRepository implements DocenteRepositoryPort {
    async findByMateria(materia: string): Promise<Docente | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM docentes WHERE materia = ?', [materia]);
        return rows.length > 0 ? rows[0] : null;
    }
    async createDocente(docente: Docente): Promise<Docente > {
        const [result]: any = await pool.query(
            'INSERT INTO docentes (id_docente, id_usuario, materia, direccion) VALUES (?, ?, ?, ?)',
            [docente.id_docente, docente.id_usuario, docente.materia, docente.direccion]
        );
        return docente;
    }
    async findById(id_docente: string): Promise<Docente | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM docentes WHERE id_docente = ?', [id_docente]);
        return rows.length > 0 ? rows[0] : null;
    }
    async update(id_docente: string, updatedData: any): Promise<Docente | null> {
        await pool.query('UPDATE docentes SET materia = ?, direccion = ? WHERE id_docente = ?', [updatedData.materia, updatedData.direccion, id_docente]);
        return this.findById(id_docente);
    }
}
