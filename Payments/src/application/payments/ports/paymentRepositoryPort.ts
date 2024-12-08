import { Transaccion } from '../../../adapters/out/database/transacciones/transaccionesEntity';
import { Estado } from '../../../core/payments/domain/estado';

export interface PaymentRepositoryPort {
    create(data: {
        id_usuario: string;
        paypal_order_id: string;
        total: number;
        estado_id: number;  // Referencia al estado (id del estado)
        metadata: object;
    }): Promise<Transaccion>;

    findById(id: string): Promise<Transaccion | null>;

    findByPaypalOrderId(paypalOrderId: string): Promise<Transaccion | null>;

    updateStatus(paypalOrderId: string, estado_id: number): Promise<Transaccion>;
}
