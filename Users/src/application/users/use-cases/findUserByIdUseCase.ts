import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { User } from '../../../core/users/domain/userEntity';

export class ReadUserUseCase {
    constructor(private readonly userRepository: UserRepositoryPort) {}

    async execute(userId: string): Promise<User | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
