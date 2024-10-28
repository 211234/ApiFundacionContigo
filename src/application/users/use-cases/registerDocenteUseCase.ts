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

        // Verificar que el usuario existe y es de tipo 'Docente'
        if (!user || user.tipo !== 'Docente') {
            throw new Error('User must be of type Docente and exist');
        }

        // Crear y guardar el docente con un nuevo id_docente
        const docente = new Docente(uuidv4(), docenteDTO.id_usuario, docenteDTO.materia);
        return await this.docenteRepository.createDocente(docente);
    }
}
