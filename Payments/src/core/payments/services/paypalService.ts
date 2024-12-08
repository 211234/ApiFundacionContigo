import { paypalClient } from '../../../infrastructure/config/paypalClient';
import paypal from '@paypal/checkout-server-sdk';

/**
 * Crear una orden en PayPal
 * @param total - Total de la transacción
 * @param currency - Moneda (por defecto MXN)
 */
export const createOrder = async (total: string, currency: string = 'MXN') => {
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: currency, // Ahora usa MXN como predeterminado
                    value: total,
                },
            },
        ],
    });

    try {
        const response = await paypalClient.execute(request);
        return response.result;
    } catch (error) {
        console.error('Error al crear la orden en PayPal:', error);
        throw error;
    }
};

/**
 * Capturar una orden en PayPal
 * @param orderId - ID de la orden a capturar
 */
export const captureOrder = async (orderId: string) => {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);

    // payment_source puede estar vacío o incluir detalles específicos según sea necesario
    request.requestBody({
        payment_source: {} as any
    });

    try {
        const response = await paypalClient.execute(request);
        return response.result;
    } catch (error) {
        console.error('Error al capturar el pago en PayPal:', error);
        throw error;
    }
};
