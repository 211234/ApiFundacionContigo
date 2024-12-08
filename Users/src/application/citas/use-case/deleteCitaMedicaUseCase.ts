import { CitaMedicaRepositoryPort } from '../ports/citaMedicaRepositoryPort';

export class DeleteCitaMedicaUseCase {
    constructor(private readonly citaMedicaRepository: CitaMedicaRepositoryPort) { }

    async execute(id_cita: string): Promise<void> {
        await this.citaMedicaRepository.deleteCita(id_cita);
    }
}