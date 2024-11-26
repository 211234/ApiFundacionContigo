import { LeadRepository } from '../../../adapters/out/database/lead/leadRepository';
import { Lead } from '../../../core/lead/domain/lead';

export class GetLeadsUseCase {
    constructor(private leadRepository: LeadRepository) { }

    async execute(): Promise<Lead[]> {
        // Obtener todos los leads pendientes
        return await this.leadRepository.getPendingLeads();
    }
}
