import { UserRepositoryPort } from '../../../application/users/ports/userRepositoryPort';
import { RegisterUserDTO } from '../../../adapters/in/users/dtos/registerUserDto';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';
import { User } from '../domain/userEntity';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuditService } from './auditService';

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
    async findUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async verifyUser(idOrEmail: string, searchByEmail = false): Promise<void> {
        const user = searchByEmail
            ? await this.userRepository.findByEmail(idOrEmail)
            : await this.userRepository.findById(idOrEmail);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.estado_verificacion === 'confirmado') {
            throw new Error('El usuario ya está confirmado');
        }

        await this.updateVerificationStatus(idOrEmail, 'confirmado', searchByEmail);
        console.log(`Usuario ${idOrEmail} confirmado exitosamente.`);
    }

    // Actualizar estado de verificación del usuario
    async updateVerificationStatus(
        idOrEmail: string,
        status: 'pendiente' | 'confirmado',
        searchByEmail = false
    ): Promise<void> {
        console.log('Buscando usuario con', searchByEmail ? `correo: ${idOrEmail}` : `id: ${idOrEmail}`);

        if (searchByEmail) {
            const user = await this.userRepository.findByEmail(idOrEmail);
            if (!user) throw new Error('Usuario no encontrado');
            idOrEmail = user.id_usuario;
        }

        // Llama al repositorio para actualizar el estado
        await this.userRepository.updateVerificationStatus(idOrEmail, status, searchByEmail);

        console.log(`Estado de verificación actualizado a ${status} para ${idOrEmail}`);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: idOrEmail, // Si usas correo, ajusta para buscar ID
            accion: 'ACTUALIZAR_ESTADO_VERIFICACION',
            entidad_afectada: 'usuarios',
            id_entidad: idOrEmail,
        });
    }


    // Actualizar un usuario
    async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User | null> {
        // Buscar al usuario
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Actualizar el usuario
        const updatedUser = await this.userRepository.updateUser(id, updateUserDTO);

        // Registrar auditoría para la actualización del usuario
        await this.auditService.createAuditLog({
            id_usuario: id,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'usuarios',
            id_entidad: id,
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
