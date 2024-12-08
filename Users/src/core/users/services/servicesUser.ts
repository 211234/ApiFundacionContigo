import { UserRepositoryPort } from '../../../application/users/ports/userRepositoryPort';
import { RegisterUserDTO } from '../../../adapters/in/users/dtos/registerUserDto';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';
import { User } from '../domain/userEntity';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuditService } from './auditService';
import { pool } from '../../../infrastructure/config/database';

export class UserService {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly auditService: AuditService,
    ) { }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Buscar un usuario por correo
    async findByEmail(correo: string): Promise<User | null> {
        return await this.userRepository.findByEmail(correo);
    }

    // Método para registrar un usuario
    async registerUser(userDTO: RegisterUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(userDTO.correo);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await this.hashPassword(userDTO.password);
        const user = new User(
            uuidv4(),
            userDTO.nombre,
            userDTO.correo,
            hashedPassword,
            userDTO.telefono,
            userDTO.tipo
        );
        return await this.userRepository.createUser(user);
    }

    // Buscar un usuario por ID
    async findUserById(id_usuario: string): Promise<User | null> {
        return await this.userRepository.findById(id_usuario);
    }

    async verifyUser(id_usuario: string, searchByEmail = false): Promise<void> {
        const user = searchByEmail
            ? await this.userRepository.findByEmail(id_usuario)
            : await this.userRepository.findById(id_usuario);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.estado_verificacion === 'confirmado') {
            throw new Error('El usuario ya está confirmado');
        }

        await this.updateVerificationStatus(id_usuario, 'confirmado', searchByEmail);
        console.log(`Usuario ${id_usuario} confirmado exitosamente.`);
    }

    // Actualizar estado de verificación del usuario
    async updateVerificationStatus(id_usuario: string, status: 'pendiente' | 'confirmado', searchByEmail = false): Promise<void> {
        console.log(`[DEBUG] Iniciando actualización de estado:
            ID/Correo: ${id_usuario}
            Nuevo estado: ${status}
            Buscar por Email: ${searchByEmail}`);

        const query = searchByEmail
            ? `UPDATE usuarios SET estado_verificacion = ? WHERE correo = ?`
            : `UPDATE usuarios SET estado_verificacion = ? WHERE id_usuario = ?`;

        const [result]: [any, any] = await pool.query(query, [status, id_usuario]);

        console.log(`[DEBUG] Resultado de la actualización:
            Filas afectadas: ${result.affectedRows}`);

        if (result.affectedRows === 0) {
            console.error(`[ERROR] No se actualizó ninguna fila. Verifica que el usuario existe.`);
            throw new Error('Usuario no encontrado o estado no actualizado');
        }
    }

    // Actualizar un usuario
    async updateUser(id_usuario: string, updateUserDTO: UpdateUserDTO): Promise<User | null> {
        // Buscar al usuario
        const user = await this.userRepository.findById(id_usuario);
        if (!user) {
            throw new Error('User not found');
        }

        // Actualizar el usuario
        const updatedUser = await this.userRepository.updateUser(id_usuario, updateUserDTO);

        // Registrar auditoría para la actualización del usuario
        await this.auditService.createAuditLog({
            id_usuario: id_usuario,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario
        });

        return updatedUser;
    }

    // Eliminar un usuario
    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        await this.userRepository.deleteUser(id);

        // Registrar auditoría para el borrado del usuario
        await this.auditService.createAuditLog({
            id_usuario: id,
            accion: 'BORRAR',
            entidad_afectada: 'usuarios',
            id_entidad: id,
        });
    }

    async loginUser(id_usuario: string) {
        await this.auditService.createAuditLog({
            id_usuario,
            accion: 'LOGIN',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario,
        });
    }

    async logoutUser(id_usuario: string) {
        await this.auditService.createAuditLog({
            id_usuario,
            accion: 'LOGOUT',
            entidad_afectada: 'usuarios',
            id_entidad: id_usuario,
        });
    }
}
