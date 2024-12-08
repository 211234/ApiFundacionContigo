import { Estado } from '../../../core/payments/domain/estado';

export interface EstadoRepositoryPort {
    findByEstado(estado: string): Promise<Estado | null>;
}
