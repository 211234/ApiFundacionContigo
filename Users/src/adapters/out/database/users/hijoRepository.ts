import { pool } from '../../../../infrastructure/config/database';
import { Hijo } from '../../../../core/users/domain/hijoEntity';
import { HijoRepositoryPort } from '../../../../application/users/ports/hijoRepositoryPort';

export class HijoRepository implements HijoRepositoryPort {
    async findById(id_hijo: string): Promise<Hijo | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM hijos WHERE id_hijo = ?', [id_hijo]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createHijo(hijo: Hijo): Promise<Hijo> {
        const [result]: any = await pool.query(
            'INSERT INTO hijos (id_hijo, id_usuario, nombre, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?)',
            [hijo.id_hijo, hijo.id_usuario, hijo.nombre, hijo.fecha_nacimiento, hijo.direccion]
        );
        return hijo;
    }

    async update(id_hijo: string, updatedData: any): Promise<Hijo | null> {
        await pool.query('UPDATE hijos SET nombre = ?, fecha_nacimiento = ?, direccion = ? WHERE id_hijo = ?', [updatedData.nombre, updatedData.fecha_nacimiento, updatedData.direccion, id_hijo]);
        return this.findById(id_hijo);
    }

    async findByNombre(nombre: string): Promise<Hijo | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM hijos WHERE nombre = ?', [nombre]);
        return rows.length > 0 ? rows[0] : null;
    }
}
