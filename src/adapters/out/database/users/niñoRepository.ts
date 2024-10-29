import { pool } from '../../../../infrastructure/config/database';
import { Niño } from '../../../../core/users/domain/niñoEntity';

export class NiñoRepository {
    async createNiño(niño: Niño): Promise<Niño> {
        await pool.query(
            'INSERT INTO niños (id_niño, id_usuario, nombre, fecha_nacimiento, direccion) VALUES (?, ?, ?, ?, ?)',
            [niño.id_niño, niño.id_usuario, niño.nombre, niño.fecha_nacimiento, niño.direccion]
        );
        return niño;
    }
}
