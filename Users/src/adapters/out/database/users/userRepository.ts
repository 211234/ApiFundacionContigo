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
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as User;
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

    async findById(id_usuario: string): Promise<User | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id_usuario]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as User;
    }

    async updateUser(id_usuario: string, updateData: UpdateUserDTO): Promise<User> {
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
        values.push(id_usuario);

        const query = `UPDATE usuarios SET ${fieldsToUpdate.join(', ')} WHERE id_usuario = ?`;

        // Ejecutar la consulta
        await pool.query(query, values);

        // Buscar y devolver el usuario actualizado
        const updatedUser = await this.findById(id_usuario);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }

        return updatedUser;
    }

    async confirmUser(id_usuario: string): Promise<{ id_usuario: string; nombre: string; correo: string } | null> {
        const [rows]: [any[], any] = await pool.query(
            'SELECT id_usuario, nombre, correo FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0];

        await this.updateVerificationStatus(id_usuario, 'confirmado', false);

        return user;
    }

    async updateVerificationStatus(id_usuario: string, status: 'pendiente' | 'confirmado', searchByEmail: boolean): Promise<void> {
        console.log(`[DEBUG] Parámetros de actualización:
            Correo/ID: ${id_usuario}
            Nuevo Estado: ${status}
            Buscar por Email: ${searchByEmail}`);

            const query = searchByEmail
            ? `UPDATE usuarios SET estado_verificacion = ? WHERE correo = ?`
            : `UPDATE usuarios SET estado_verificacion = ? WHERE id_usuario = ?`;

        try {
            const [result]: [any, any] = await pool.query(query, [status, id_usuario]);

            console.log(`[DEBUG] Resultado de la actualización:
                Query: ${query}
                Filas afectadas: ${result.affectedRows}
                Mensajes: ${result.message}`);

            if (result.affectedRows === 0) {
                console.error(`[ERROR] No se actualizó ninguna fila para: ${id_usuario}`);
                throw new Error('Usuario no encontrado o estado no actualizado');
            }
        } catch (error) {
            console.error(`[ERROR] Error en updateVerificationStatus:`, error);
            throw error;
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

    async getPadresConHijos(): Promise<any[]> {
        const query = `
            SELECT 
                u.id_usuario AS id_padre, 
                u.nombre AS nombre_padre, 
                u.correo AS correo_padre, 
                h.id_hijo, 
                h.nombre AS nombre_hijo, 
                h.fecha_nacimiento 
            FROM usuarios u
            LEFT JOIN hijos h ON u.id_usuario = h.id_usuario
            WHERE u.tipo = 'Padre'
        `;

        const [rows]: [any[], any] = await pool.execute(query);

        // Organizar la respuesta para que sea un arreglo de padres con sus hijos
        const padresConHijos = rows.reduce((acc, row) => {
            let padre = acc.find((p: any) => p.id_padre === row.id_padre);
            if (!padre) {
                padre = {
                    id_padre: row.id_padre,
                    nombre_padre: row.nombre_padre,
                    correo_padre: row.correo_padre,
                    hijos: []
                };
                acc.push(padre);
            }
            padre.hijos.push({
                id_hijo: row.id_hijo,
                nombre_hijo: row.nombre_hijo,
                fecha_nacimiento: row.fecha_nacimiento
            });
            return acc;
        }, []);

        return padresConHijos;
    }
}
