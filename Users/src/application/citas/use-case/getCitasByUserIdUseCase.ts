import { CitaMedicaRepositoryPort } from '../ports/citaMedicaRepositoryPort';

export class GetCitasByUserIdUseCase {
    constructor(private readonly citaMedicaRepository: CitaMedicaRepositoryPort) { }

    async execute(id_usuario: string) {
        return await this.citaMedicaRepository.getCitasByUserId(id_usuario);
    }
}
