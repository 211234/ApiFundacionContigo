import { EventPublisherPort } from '../ports/eventPublisherPort';
import { UserRepositoryPort } from '../ports/userRepositoryPort';

export class ConfirmUserAccountUseCase {
    private eventPublisher: EventPublisherPort;
    private userRepository: UserRepositoryPort;

    constructor(eventPublisher: EventPublisherPort, userRepository: UserRepositoryPort) {
        this.eventPublisher = eventPublisher;
        this.userRepository = userRepository;
    }

    public async execute(userId: string): Promise<void> {
        // Confirmar el usuario en la base de datos
        const user = await this.userRepository.confirmUser(userId);

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        console.log(`User ${userId} confirmed`);

        // Publicar el evento USER_CONFIRMED
        await this.eventPublisher.publish('USER_CONFIRMED', {
            id_usuario: user.id_usuario,
            nombre: user.nombre,
            correo: user.correo,
        });
    }
}
