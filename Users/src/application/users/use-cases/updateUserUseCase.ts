import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { UpdateUserDTO } from '../../../adapters/in/users/dtos/updateUserDto';
import { User } from '../../../core/users/domain/userEntity';
import { AuditService } from '../../../core/users/services/auditService';

export class UpdateUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly auditService: AuditService
    ) {}

    async execute(userId: string, updateData: UpdateUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updatedUser = await this.userRepository.updateUser(userId, updateData);

        // Registrar auditoría de actualización
        await this.auditService.createAuditLog({
            id_usuario: userId,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'usuarios',
            id_entidad: userId,
        });

        return updatedUser;
    }
}
