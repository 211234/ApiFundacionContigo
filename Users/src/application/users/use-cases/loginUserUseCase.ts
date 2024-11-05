import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { LoginUserDTO } from '../../../adapters/in/users/dtos/loginUserDto';
import { UserService } from '../../../core/users/services/servicesUser';

export class LoginUserUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userService: UserService
    ) { }

    async execute(loginDTO: LoginUserDTO) {
        const user = await this.userRepository.findByEmail(loginDTO.correo);
        if (!user || !(await this.userService.comparePasswords(loginDTO.password, user.password))) {
            throw new Error('Invalid credentials');
        }
        return user;
    }
}
