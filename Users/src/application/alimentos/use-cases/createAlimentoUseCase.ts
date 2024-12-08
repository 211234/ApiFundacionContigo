import { AlimentoRepositoryPort } from '../../alimentos/ports/alimentoRepositoryPort';
import { Alimento } from '../../../core/alimentos/domain/alimentoEntity';
import { v4 as uuidv4 } from 'uuid';

export class CreateAlimentoUseCase {
    constructor(private readonly alimentoRepository: AlimentoRepositoryPort) { }

    async execute(data: Omit<Alimento, 'id_alimento'>): Promise<Alimento> {
        const id_alimento = uuidv4(); // Generar ID único
        const alimento = new Alimento(id_alimento, data.id_usuario, data.nombre, data.categoria, data.horario);
        return await this.alimentoRepository.createAlimento(alimento);
    }
}
