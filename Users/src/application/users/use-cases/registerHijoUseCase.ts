import { HijoRepositoryPort } from '../ports/hijoRepositoryPort';
import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { RegisterHijoDTO } from '../../../adapters/in/users/dtos/registerHijoDto';
import { Hijo } from '../../../core/users/domain/hijoEntity';
import { v4 as uuidv4 } from 'uuid';

export class RegisterHijoUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly hijoRepository: HijoRepositoryPort
    ) {}

    async execute(hijoDTO: RegisterHijoDTO): Promise<Hijo> {
        const padre = await this.userRepository.findById(hijoDTO.id_padre);

        if (!padre || padre.tipo !== 'Padre') {
            throw new Error('Solo un padre puede registrar un niño.');
        }

        const hijo = new Hijo(
            uuidv4(),
            hijoDTO.id_padre,
            hijoDTO.nombre,
            hijoDTO.fecha_nacimiento,
            hijoDTO.direccion
        );

        return await this.hijoRepository.createHijo(hijo);
    }
}
