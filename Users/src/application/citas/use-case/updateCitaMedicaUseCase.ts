import { CitaMedica } from '../../../core/citas/domain/citaMedicaEntity';
import { CitaMedicaRepositoryPort } from '../ports/citaMedicaRepositoryPort';

export class UpdateCitaMedicaUseCase {
    constructor(private readonly citaMedicaRepository: CitaMedicaRepositoryPort) { }

    async execute(data: CitaMedica): Promise<void> {
        await this.citaMedicaRepository.updateCita(data);
    }
}
