import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { RegisterUserDTO } from '../../../adapters/in/users/dtos/registerUserDto';
import { User } from '../../../core/users/domain/userEntity';
import { UserService } from '../../../core/users/services/servicesUser';
import { v4 as uuidv4 } from 'uuid';

export class RegisterUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userService: UserService
    ) { }

    async execute(userDTO: RegisterUserDTO): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(userDTO.correo);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Contar el número de usuarios registrados
        const existingUsersCount = await this.userRepository.countUsers();

        // Si es el primer usuario registrado, asignar "Administrador"; de lo contrario, asignar "Padre" si no se especifica otro tipo
        const userType = existingUsersCount === 0 ? 'Administrador' : userDTO.tipo || 'Padre';

        // Hashear la contraseña
        const hashedPassword = await this.userService.hashPassword(userDTO.password);

        // Crear el nuevo usuario con el tipo asignado
        const user = new User(uuidv4(), userDTO.nombre, userDTO.correo, hashedPassword, userDTO.telefono, userType);

        // Guardar el nuevo usuario en la base de datos
        return await this.userRepository.createUser(user);
    }
}
