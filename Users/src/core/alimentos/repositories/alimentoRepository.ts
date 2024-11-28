import { AlimentoRepositoryPort } from '../../../application/alimentos/ports/alimentoRepositoryPort';
import { Alimento } from '../../../core/alimentos/domain/alimentoEntity';
import { AlimentoDTO } from '../../../adapters/in/alimentos/dtos/createAlimentoDto';

export class AlimentoRepositoryImpl implements AlimentoRepositoryPort {
    constructor(
        private alimentoRepo: any // Esta será la instancia del repositorio que maneja la base de datos
    ) { }

    // Buscar un alimento por ID
    async findById(id_alimento: string): Promise<Alimento | null> {
        return await this.alimentoRepo.findOne({ where: { id_alimento } });
    }

    // Obtener todos los alimentos de un usuario
    async getAlimentosByUserId(id_usuario: string): Promise<Alimento[]> {
        return await this.alimentoRepo.find({ where: { id_usuario } });
    }

    // Crear un nuevo alimento
    async createAlimento(alimento: AlimentoDTO): Promise<Alimento> {
        return await this.alimentoRepo.save(alimento);
    }

    // Actualizar un alimento
    async updateAlimento(id_alimento: string, alimento: Alimento): Promise<void> {
        await this.alimentoRepo.update(id_alimento, alimento);
    }

    // Eliminar un alimento
    async deleteAlimento(id_alimento: string): Promise<void> {
        await this.alimentoRepo.delete(id_alimento);
    }
}
