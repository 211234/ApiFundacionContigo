import { LeadRepository } from '../../../adapters/out/database/lead/leadRepository';

export class ConfirmLeadUseCase {
    constructor(private leadRepository: LeadRepository) { }

    async execute(id_lead: string): Promise<void> {
        // Validar que el lead exista
        const lead = await this.leadRepository.findById(id_lead);
        if (!lead) {
            throw new Error('El lead no existe.');
        }

        // Confirmar el lead
        await this.leadRepository.confirmLead(id_lead);
    }
}
