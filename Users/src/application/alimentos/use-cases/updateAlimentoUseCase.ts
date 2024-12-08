import { AlimentoRepositoryPort } from '../../alimentos/ports/alimentoRepositoryPort';
import { Alimento } from '../../../core/alimentos/domain/alimentoEntity';

export class UpdateAlimentoUseCase {
    constructor(private readonly alimentoRepository: AlimentoRepositoryPort) { }

    async execute(id_alimento: string, alimento: Alimento): Promise<void> {
        await this.alimentoRepository.updateAlimento(id_alimento, alimento);
    }
}
