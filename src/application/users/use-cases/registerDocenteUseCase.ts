import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { DocenteRepositoryPort } from '../ports/docenteRepositoryPort';
import { RegisterDocenteDTO } from '../../../adapters/in/users/dtos/registerDocenteDto';
import { Docente } from '../../../core/users/domain/docenteEntity';
import { v4 as uuidv4 } from 'uuid';

export class RegisterDocenteUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly docenteRepository: DocenteRepositoryPort
    ) {}

    async execute(docenteDTO: RegisterDocenteDTO): Promise<Docente> {
        const user = await this.userRepository.findById(docenteDTO.id_usuario);

        if (!user || user.tipo !== 'Docente') {
            throw new Error('El usuario debe existir y ser de tipo Docente');
        }

        const docente = new Docente(uuidv4(), docenteDTO.id_usuario, docenteDTO.materia, docenteDTO.direccion);
        return await this.docenteRepository.createDocente(docente);
    }
}
