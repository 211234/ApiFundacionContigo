import { AlimentoRepositoryPort } from '../../alimentos/ports/alimentoRepositoryPort';
import { Alimento } from '../../../core/alimentos/domain/alimentoEntity';

export class GetAlimentosByUserIdUseCase {
    constructor(private readonly alimentoRepository: AlimentoRepositoryPort) { }

    async execute(id_usuario: string): Promise<Alimento[]> {
        return await this.alimentoRepository.getAlimentosByUserId(id_usuario);
    }
}
