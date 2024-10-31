import { User } from '../../../core/users/domain/userEntity';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';

export interface UserRepositoryPort {
    findByEmail(email: string): Promise<User | null>;
    createUser(user: User): Promise<User>;
    countUsers(): Promise<number>;
    findById(id: string): Promise<User | null>;
    updateUser(id: string, updateData: UpdateUserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
