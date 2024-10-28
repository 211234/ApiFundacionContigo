import { User } from '../domain/userEntity';
import { UserRepositoryImpl as UserRepository } from './userRepository';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';

export class UserRepositoryImpl implements UserRepository {
    private userRepo: any;

    async findById(id_usuario: string): Promise<User | null> {
        return await this.userRepo.findOne({ where: { id_usuario } });
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepo.save(user);
    }

    async updateUser(id_usuario: string, updateData: UpdateUserDTO): Promise<User> {
        await this.userRepo.update(id_usuario, updateData);
        const updatedUser = await this.findById(id_usuario);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }
        return updatedUser;
    }

    async deleteUser(id_usuario: string): Promise<void> {
        const result = await this.userRepo.delete(id_usuario);
        if (result.affected === 0) {
            throw new Error('User not found or already deleted');
        }
    }
}
