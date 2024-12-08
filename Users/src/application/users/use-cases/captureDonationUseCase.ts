import { EventPublisherPort } from '../ports/eventPublisherPort';

export class CaptureDonationUseCase {
    constructor(private readonly eventPublisher: EventPublisherPort) {}

    async capture(orderId: string, id_usuario: string): Promise<void> {
        if (!orderId || !id_usuario) {
            throw new Error('Faltan parámetros obligatorios');
        }

        // Publica un evento para que la API Payments capture la donación
        await this.eventPublisher.publish('DONATION_CAPTURE_REQUESTED', {
            orderId,
            id_usuario,
        });
    }
}
