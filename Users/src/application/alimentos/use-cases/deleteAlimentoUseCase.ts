import { AlimentoRepositoryPort } from '../../alimentos/ports/alimentoRepositoryPort';

export class DeleteAlimentoUseCase {
    constructor(private readonly alimentoRepository: AlimentoRepositoryPort) { }

    async execute(id_alimento: string): Promise<void> {
        await this.alimentoRepository.deleteAlimento(id_alimento);
    }
}
