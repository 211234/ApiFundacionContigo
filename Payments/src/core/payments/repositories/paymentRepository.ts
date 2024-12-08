import { Transaccion } from '../../../adapters/out/database/transacciones/transaccionesEntity';
import { Estado } from '../../../core/payments/domain/estado';

export interface PaymentRepositoryPort {
    create(data: { usuario_id: string; total: number; estado: Estado; metadata: object }): Promise<Transaccion>;
    findById(id: string): Promise<Transaccion | null>;
    updateStatus(id: string, estado: Estado): Promise<Transaccion>;
}
