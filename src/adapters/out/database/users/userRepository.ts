import { pool } from '../../../../infrastructure/config/database';
import { User } from '../../../../core/users/domain/userEntity';
import { UserRepositoryPort } from '../../../../application/users/ports/userRepositoryPort';
import { UpdateUserDTO } from '../../../in/users/dtos/updateUserDto';

export class UserRepository implements UserRepositoryPort {
    async findByEmail(correo: string): Promise<User | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Crear un nuevo usuario
    async createUser(user: User): Promise<User> {
        const [result]: any = await pool.query(
            'INSERT INTO usuarios (id_usuario, nombre, correo, contraseña, telefono, tipo, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.id_usuario, user.nombre, user.correo, user.contraseña, user.telefono, user.tipo, user.fecha_registro]
        );
        return { ...user, id_usuario: (result as any).insertId };
    }

    async countUsers(): Promise<number> {
        const [rows]: [any[], any] = await pool.query('SELECT COUNT(*) AS count FROM usuarios');
        return rows[0].count;
    }

    // Buscar usuario por ID
    async findById(id: string): Promise<User | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Actualizar usuario por ID
    async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
        await pool.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, telefono = ?, tipo = ? WHERE id_usuario = ?',
            [
                updateData.nombre,
                updateData.correo,
                updateData.contraseña,
                updateData.telefono,
                updateData.tipo,
                id
            ]
        );
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }
        return updatedUser;
    }

    // Eliminar usuario por ID
    async deleteUser(id: string): Promise<void> {
        const [result]: any = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('User not found or already deleted');
        }
    }
}
