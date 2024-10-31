import { DocenteRepositoryPort } from '../ports/docenteRepositoryPort';
import { Docente } from '../../../core/users/domain/docenteEntity';
import { UpdateDocenteDTO } from '../../../adapters/in/users/dtos/updateDocenteDto';


export class UpdateDocenteUseCase {
    constructor(private readonly docenteRepository: DocenteRepositoryPort) { }

    async execute(id_docente: string, updatedData: Partial<Docente>): Promise<Docente | null> {
        const existingDocente = await this.docenteRepository.findById(id_docente);
        if (!existingDocente) {
            throw new Error('Docente no encontrado');
        }

        return this.docenteRepository.update(id_docente, updatedData);
    }
}
