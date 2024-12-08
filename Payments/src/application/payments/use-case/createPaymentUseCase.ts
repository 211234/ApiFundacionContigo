import { PaymentRepositoryPort } from '../ports/paymentRepositoryPort';
import { EstadoRepositoryPort } from '../ports/estadoRepositoryPort';

export class CreatePaymentUseCase {
    constructor(
        private readonly paymentRepository: PaymentRepositoryPort,
        private readonly estadoRepository: EstadoRepositoryPort
    ) { }

    async execute(data: { usuarioId: string; total: number; metadata: object }) {
        const estadoPendiente = await this.estadoRepository.findByEstado('pendiente');
        if (!estadoPendiente) throw new Error('Estado pendiente no encontrado');

        return this.paymentRepository.create({
            id_usuario: data.usuarioId,
            total: data.total,
            estado_id: estadoPendiente.id,
            metadata: data.metadata,
            paypal_order_id: ''
        });
    }
}
