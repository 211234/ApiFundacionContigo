import { DocenteRepositoryPort } from '../../../../application/users/ports/docenteRepositoryPort';
import { Docente } from '../../../../core/users/domain/docenteEntity';
import { pool } from '../../../../infrastructure/config/database';

export class DocenteRepository implements DocenteRepositoryPort {
    async createDocente(docente: Docente): Promise<Docente> {
        await pool.query(
            'INSERT INTO docentes (id_docente, id_usuario, materia, direccion) VALUES (?, ?, ?, ?)',
            [docente.id_docente, docente.id_usuario, docente.materia, docente.direccion]
        );
        return docente;
    }
}
