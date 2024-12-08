import axios from 'axios';

export class PaymentService {
    private readonly paymentsApiUrl = process.env.PAYMENTS_API_URL; // Configura la URL de tu API Payments

    /**
     * Crear una donación/pago en la API Payments
     * @param usuarioId - ID del usuario que realiza el pago
     * @param total - Total de la donación/pago
     * @param metadata - Metadatos adicionales sobre el pago
     */
    async createPayment(usuarioId: string, total: number, metadata: object) {
        try {
            const response = await axios.post(`${this.paymentsApiUrl}/v1/payments`, {
                usuarioId,
                total,
                metadata,
            });
            console.log('Respuesta de creación de pago:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al crear el pago:', error);
            throw new Error('No se pudo crear el pago. Verifica los detalles e intenta nuevamente.');
        }
    }

    /**
     * Capturar un pago en la API Payments
     * @param orderId - ID de la orden de pago en PayPal
     */
    async capturePayment(orderId: string) {
        try {
            const response = await axios.post(`${this.paymentsApiUrl}/v1/payments/capture/${orderId}`);
            console.log('Respuesta de captura de pago:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al capturar el pago:', error);
            throw new Error('No se pudo capturar el pago. Verifica los detalles e intenta nuevamente.');
        }
    }
}
