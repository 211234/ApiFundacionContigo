import { EventPublisherPort } from '../ports/eventPublisherPort';

export class CreateDonationUseCase {
    constructor(private readonly eventPublisher: EventPublisherPort) {}

    async execute(data: { id_usuario: string; total: number; metadata: object }): Promise<void> {
        if (!data.total || data.total <= 0) {
            throw new Error('Monto de la donación inválido');
        }

        // Publica un evento para que la API Payments procese la donación
        await this.eventPublisher.publish('DONATION_CREATED', {
            id_usuario: data.id_usuario,
            total: data.total,
            metadata: data.metadata,
        });
    }
}
