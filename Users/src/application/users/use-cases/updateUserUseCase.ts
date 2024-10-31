import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';
import { User } from '../../../core/users/domain/userEntity';

export class UpdateUserUseCase {
    constructor(private readonly userRepository: UserRepositoryPort) {}

    async execute(userId: string, updateData: UpdateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updatedUser = await this.userRepository.updateUser(userId, updateData);
        return updatedUser;
    }
}
