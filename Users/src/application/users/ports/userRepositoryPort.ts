import { User } from '../../../core/users/domain/userEntity';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';

export interface UserRepositoryPort {
    confirmUser(id_usuario: string): Promise<{ id_usuario: string; nombre: string; correo: string } | null>;
    findById(id_usuario: string): Promise<User | null>;
    findByEmail(correo: string): Promise<User | null>;
    isEmpty(): Promise<boolean>;
    updateVerificationStatus(correoOrId: string, status: 'pendiente' | 'confirmado', findByEmail: boolean): Promise<void>;
    createUser(user: User): Promise<User>;
    updateUser(id_usuario: string, updateData: UpdateUserDTO): Promise<User>;
    deleteUser(id_usuario: string): Promise<void>;
    getPadresConHijos(): Promise<any[]>;
}
