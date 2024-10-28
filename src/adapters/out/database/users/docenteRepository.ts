import { pool } from '../../../../infrastructure/config/database';
import { Docente } from '../../../../core/users/domain/docenteEntity';

export class DocenteRepository {
    async createDocente(docente: Docente): Promise<Docente> {
        await pool.query(
            'INSERT INTO docentes (id_docente, id_usuario, materia) VALUES (?, ?, ?)',
            [docente.id_docente, docente.id_usuario, docente.materia]
        );
        return docente;
    }
}
