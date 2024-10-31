import { UserRepositoryPort } from '../ports/userRepositoryPort';

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepositoryPort) {}

    async execute(userId: string): Promise<void> { // Cambiado a string
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }

        await this.userRepository.deleteUser(userId);
    }
}
