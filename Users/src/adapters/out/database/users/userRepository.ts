import { pool } from '../../../../infrastructure/config/database';
import { User } from '../../../../core/users/domain/userEntity';
import { UserRepositoryPort } from '../../../../application/users/ports/userRepositoryPort';
import { UpdateUserDTO } from '../../../in/users/dtos/updateUserDto';

export class UserRepository implements UserRepositoryPort {
    private auditService: any; // Usaremos un método para asignar esto más tarde

    constructor() { }

    setAuditService(auditService: any) {
        this.auditService = auditService;
    }

    async findByEmail(correo: string): Promise<User | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows.length > 0 ? rows[0] : null;
    }

    async createUser(user: User): Promise<User> {
        await pool.query(
            'INSERT INTO usuarios (id_usuario, nombre, correo, password, telefono, tipo, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.id_usuario, user.nombre, user.correo, user.password, user.telefono, user.tipo, user.fecha_registro]
        );
        return user;
    }


    async isEmpty(): Promise<boolean> {
        const [rows]: [any[], any] = await pool.query('SELECT id_usuario FROM usuarios LIMIT 1');
        return rows.length === 0;
    }

    async findById(id: string): Promise<User | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
        // Construir dinámicamente la consulta y los valores
        const fieldsToUpdate = [];
        const values = [];

        if (updateData.nombre) {
            fieldsToUpdate.push('nombre = ?');
            values.push(updateData.nombre);
        }
        if (updateData.correo) {
            fieldsToUpdate.push('correo = ?');
            values.push(updateData.correo);
        }
        if (updateData.password) {
            fieldsToUpdate.push('password = ?');
            values.push(updateData.password);
        }
        if (updateData.telefono) {
            fieldsToUpdate.push('telefono = ?');
            values.push(updateData.telefono);
        }

        // Asegurarse de que hay campos para actualizar
        if (fieldsToUpdate.length === 0) {
            throw new Error('No fields to update');
        }

        // Agregar el ID al final de los valores
        values.push(id);

        const query = `UPDATE usuarios SET ${fieldsToUpdate.join(', ')} WHERE id_usuario = ?`;

        // Ejecutar la consulta
        await pool.query(query, values);

        // Buscar y devolver el usuario actualizado
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }

        return updatedUser;
    }

    async updateVerificationStatus(correo: string, status: 'pendiente' | 'confirmado'): Promise<void> {
        const query = `UPDATE usuarios SET estado_verificacion = ? WHERE id_usuario = ?`;
        const [result]: any = await pool.query(query, [status, correo]);

        console.log(`Intentando actualizar estado de verificación para el usuario ${correo} a ${status}`);
        console.log('Resultado de la consulta:', result);

        if (result.affectedRows === 0) {
            throw new Error('Usuario no encontrado o estado no actualizado');
        }
    }


    // Operaciones relacionadas con la tabla `eventos_procesados`
    async isEventProcessed(eventId: string): Promise<boolean> {
        const [rows]: [any[], any] = await pool.query(
            'SELECT COUNT(*) AS count FROM eventos_procesados WHERE id_evento = ?',
            [eventId]
        );
        return rows[0].count > 0;
    }

    async saveProcessedEvent(eventId: string, descripcion: string): Promise<void> {
        await pool.query(
            'INSERT INTO eventos_procesados (id_evento, descripcion) VALUES (?, ?)',
            [eventId, descripcion]
        );
    }

    async deleteUser(id: string): Promise<void> {
        const [result]: any = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('User not found or already deleted');
        }
    }
}
