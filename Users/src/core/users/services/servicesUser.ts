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
        private readonly auditService: AuditService
    ) {}

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Create (register user)
    async registerUser(userDTO: RegisterUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(userDTO.correo);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashedPassword = await this.hashPassword(userDTO.password);
        const user = new User(uuidv4(), userDTO.nombre, userDTO.correo, hashedPassword, userDTO.telefono, userDTO.tipo);
        return await this.userRepository.createUser(user);
    }

    // Read (find user by ID)
    async findUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async updateUser(id: string, updateUserDTO: UpdateUserDTO): Promise<User | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        user.nombre = updateUserDTO.nombre || user.nombre;
        user.correo = updateUserDTO.correo || user.correo;
        user.password = updateUserDTO.password ? await this.hashPassword(updateUserDTO.password) : user.password;
        user.telefono = updateUserDTO.telefono || user.telefono;

        const updatedUser = await this.userRepository.updateUser(id, user);

        // Registrar auditoría para actualización
        await this.auditService.createAuditLog({
            id_usuario: id,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'usuarios',
            id_entidad: id,
        });

        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        await this.userRepository.deleteUser(id);

        // Registrar auditoría para borrado
        await this.auditService.createAuditLog({
            id_usuario: id,
            accion: 'BORRAR',
            entidad_afectada: 'usuarios',
            id_entidad: id,
        });
    }

    async loginUser(id: string): Promise<User | null> {
        return await this.userRepository.findById(id); 
    }
    
    async logoutUser(id: string): Promise<void> {
        // Implementa la lógica para el logout si es necesario
    }
}
