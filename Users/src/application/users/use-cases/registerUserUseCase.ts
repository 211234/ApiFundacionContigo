import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { RegisterUserDTO } from '../../../adapters/in/users/dtos/registerUserDto';
import { User } from '../../../core/users/domain/userEntity';
import { UserService } from '../../../core/users/services/servicesUser';
import { EventPublisherPort } from '../../users/ports/eventPublisherPort';
import { TokenService } from '../../../core/users/services/tokenService';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userService: UserService,
        private readonly eventPublisher: EventPublisherPort,
        private readonly tokenService: TokenService
    ) { }

    async execute(userDTO: RegisterUserDTO): Promise<User> {
        // Verificar si ya existe un usuario con el correo proporcionado
        const existingUser = await this.userRepository.findByEmail(userDTO.correo);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        const isFirstUser = await this.userRepository.isEmpty();
        const userType = isFirstUser ? 'Administrador' : userDTO.tipo || 'Padre';
        
        const hashedPassword = await this.userService.hashPassword(userDTO.password);

        const user = new User(
            uuidv4(),
            userDTO.nombre,
            userDTO.correo,
            hashedPassword,
            userDTO.telefono,
            userType
        );

        const newUser = await this.userRepository.createUser(user);

        // Publicar un evento de usuario creado
        await this.eventPublisher.publish('USER_CREATED', {
            id_usuario: newUser.id_usuario,
            nombre: newUser.nombre,
            correo: newUser.correo,
            telefono: newUser.telefono,
            tipo: newUser.tipo,
        });

        return newUser;
    }
}
