import { LeadRepository } from '../../../adapters/out/database/lead/leadRepository';

export class RejectLeadUseCase {
    constructor(private leadRepository: LeadRepository) { }

    async execute(idLead: string): Promise<void> {
        // Validar que el lead exista
        const lead = await this.leadRepository.findById(idLead);
        if (!lead) {
            throw new Error('El lead no existe.');
        }

        // Rechazar el lead
        await this.leadRepository.rejectLead(idLead);
    }
}
