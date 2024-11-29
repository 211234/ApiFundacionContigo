import { DocenteRepositoryPort } from '../ports/docenteRepositoryPort';

export class DeleteDocenteUseCase {
    constructor(private readonly docenteRepository: DocenteRepositoryPort) { }

    async execute(id_docente: string): Promise<void> {
        const docente = await this.docenteRepository.findById(id_docente);
        if (!docente) {
            throw new Error('Docente no encontrado');
        }

        await this.docenteRepository.delete(id_docente);
    }
}
