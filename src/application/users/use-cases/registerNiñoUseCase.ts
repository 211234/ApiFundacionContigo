import { NiñoRepositoryPort } from '../ports/niñoRepositoryPort';
import { UserRepositoryPort } from '../ports/userRepositoryPort';
import { RegisterNiñoDTO } from '../../../adapters/in/users/dtos/registerNiñoDto';
import { Niño } from '../../../core/users/domain/niñoEntity';
import { v4 as uuidv4 } from 'uuid';

export class RegisterNiñoUseCase {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly niñoRepository: NiñoRepositoryPort
    ) {}

    async execute(niñoDTO: RegisterNiñoDTO): Promise<Niño> {
        const padre = await this.userRepository.findById(niñoDTO.id_padre);

        if (!padre || padre.tipo !== 'Padre') {
            throw new Error('Solo un padre puede registrar un niño.');
        }

        const niño = new Niño(
            uuidv4(),
            niñoDTO.id_padre,
            niñoDTO.nombre,
            niñoDTO.fecha_nacimiento,
            niñoDTO.direccion
        );

        return await this.niñoRepository.createNiño(niño);
    }
}
