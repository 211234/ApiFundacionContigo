import { Alimento } from '../../../core/alimentos/domain/alimentoEntity';

export interface AlimentoRepositoryPort {
    createAlimento(alimento: Alimento): Promise<Alimento>;
    getAlimentosByUserId(id_usuario: string): Promise<Alimento[]>;
    updateAlimento(id_alimento: string, alimento: Alimento): Promise<void>;
    deleteAlimento(id_alimento: string): Promise<void>;
}
