import { pool } from '../../../../infrastructure/config/database';
import { User } from '../../../../core/users/domain/userEntity';
import { UserRepositoryPort } from '../../../../application/users/ports/userRepositoryPort';
import { UpdateUserDTO } from '../../../in/users/dtos/updateUserDto';
import { AuditService } from '../../../../core/users/services/auditService';

export class UserRepository implements UserRepositoryPort {

    constructor(private auditService: AuditService) { }

    async findByEmail(correo: string): Promise<User | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Crear un nuevo usuario
    async createUser(user: User): Promise<User> {
        const [result]: any = await pool.query(
            'INSERT INTO usuarios (id_usuario, nombre, correo, password, telefono, tipo, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.id_usuario, user.nombre, user.correo, user.password, user.telefono, user.tipo, user.fecha_registro]
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

    async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
        await pool.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, password = ?, telefono = ? WHERE id_usuario = ?',
            [
                updateData.nombre,
                updateData.correo,
                updateData.password,
                updateData.telefono,
                id
            ]
        );

        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }

        // Registro de auditoría para actualización
        await this.auditService.createAuditLog({
            id_usuario: id,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'usuarios',
            id_entidad: id,
        });

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
