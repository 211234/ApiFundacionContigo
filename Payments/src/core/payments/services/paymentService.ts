import { PaymentRepositoryPort } from '../../../application/payments/ports/paymentRepositoryPort';
import { EstadoRepositoryPort } from '../../../application/payments/ports/estadoRepositoryPort';
import { captureOrder } from '../../../core/payments/services/paypalService';

export class PaymentService {
    constructor(
        private readonly paymentRepository: PaymentRepositoryPort,
        private readonly estadoRepository: EstadoRepositoryPort
    ) { }

    async createPayment(usuarioId: string, total: number, metadata: object) {
        const estado = await this.estadoRepository.findByEstado('pendiente');
        if (!estado) throw new Error('Estado "pendiente" no encontrado');

        return await this.paymentRepository.create({
            id_usuario: usuarioId,
            total,
            estado_id: estado.id,
            metadata,
            paypal_order_id: ''
        });
    }

    async getPaymentById(id: string) {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) throw new Error('Pago no encontrado');
        return payment;
    }

    async updatePaymentStatus(id: string, estado: string) {
        const estadoEntity = await this.estadoRepository.findByEstado(estado);
        if (!estadoEntity) throw new Error(`Estado "${estado}" no encontrado`);

        return await this.paymentRepository.updateStatus(id, estadoEntity.id);
    }

    // Método para capturar un pago
    async capturePayment(orderId: string): Promise<any> {
        try {
            // Capturar el pago usando PayPal
            const captureResult = await captureOrder(orderId);

            // Obtener estado "pagado"
            const estadoPagado = await this.estadoRepository.findByEstado('pagado');
            if (!estadoPagado) {
                throw new Error('Estado "pagado" no encontrado');
            }

            // Actualizar el estado de la transacción en la base de datos
            await this.paymentRepository.updateStatus(orderId, estadoPagado.id);

            return captureResult;
        } catch (error) {
            throw new Error(`Error al capturar el pago: ${onmessage}`);
        }
    }
}
