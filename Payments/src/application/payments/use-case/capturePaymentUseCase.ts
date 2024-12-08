import { PaymentService } from '../../../core/payments/services/paymentService';

export class CapturePaymentUseCase {
    private paymentService: PaymentService;

    constructor(paymentService: PaymentService) {
        this.paymentService = paymentService;
    }

    async execute(orderId: string): Promise<any> {
        try {
            // Capturar el pago a través del servicio
            const captureResult = await this.paymentService.capturePayment(orderId);

            // Retornar el resultado de la captura
            return {
                message: 'Pago capturado exitosamente',
                data: captureResult,
            };
        } catch (error) {
            throw new Error(`Error al capturar el pago: ${onmessage}`);
        }
    }
}
