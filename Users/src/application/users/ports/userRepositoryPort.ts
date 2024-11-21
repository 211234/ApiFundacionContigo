import { User } from '../../../core/users/domain/userEntity';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';

export interface UserRepositoryPort {
    findByEmail(correo: string): Promise<User | null>;
    updateVerificationStatus(correo: string, status: 'pendiente' | 'confirmado'): Promise<void>;
    createUser(user: User): Promise<User>;
    isEmpty(): Promise<boolean>;
    findById(id: string): Promise<User | null>;
    updateUser(id: string, updateData: UpdateUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
