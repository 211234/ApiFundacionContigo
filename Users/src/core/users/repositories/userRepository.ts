import { User } from '../domain/userEntity';
import { UserRepositoryImpl as UserRepository } from './userRepository';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';

export class UserRepositoryImpl implements UserRepository {
    private userRepo: any;

    async findById(id_usuario: string): Promise<User | null> {
        return await this.userRepo.findOne({ where: { id_usuario } });
    }

    async findByEmail(correo: string): Promise<User | null> {
        return await this.userRepo.findByEmail(correo);
    }

    async isEmpty(): Promise<boolean> {
        const users = await this.userRepo.find();
        return users.length === 0;
    }

    async updateVerificationStatus(correoOrId: string, status: 'pendiente' | 'confirmado', findByEmail: boolean): Promise<void> {
        await this.userRepo.update({ correo: correoOrId }, { estado_verificacion: status });
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
    
    public async confirmUser(userId: string): Promise<{ id_usuario: string; nombre: string; correo: string } | null> {
        const user = await this.userRepo.findOne({ where: { id_usuario: userId } });
        if (!user) {
            return null;
        }

        user.estado_verificacion = 'confirmado';
        await this.userRepo.save(user);

        return {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            correo: user.correo,
        };
    }
}
