import { LeadRepositoryPort } from '../../../application/lead/ports/leadRepositoryPort';
import { Lead } from '../domain/lead';

export class LeadService {
    constructor(private leadRepository: LeadRepositoryPort) { }

    async createLead(data: { nombre: string; correo: string; telefono: string }): Promise<void> {
        const { nombre, correo, telefono } = data;

        // Crear la entidad Lead
        const lead: Lead = {
            id_lead: crypto.randomUUID(),
            nombre,
            correo,
            telefono,
            estado: 'pendiente',
            fecha_creacion: new Date()
        };

        // Guardar en el repositorio
        await this.leadRepository.create(lead);
    }

    async confirmLead(id_lead: string): Promise<void> {
        const lead = await this.leadRepository.findById(id_lead);
        if (!lead) {
            throw new Error('El lead no existe.');
        }

        if (lead.estado !== 'pendiente') {
            throw new Error('El lead ya ha sido procesado.');
        }

        await this.leadRepository.confirmLead(id_lead);
    }

    async rejectLead(id_lead: string): Promise<void> {
        const lead = await this.leadRepository.findById(id_lead);
        if (!lead) {
            throw new Error('El lead no existe.');
        }

        if (lead.estado !== 'pendiente') {
            throw new Error('El lead ya ha sido procesado.');
        }

        await this.leadRepository.rejectLead(id_lead);
    }

    async getPendingLeads(): Promise<Lead[]> {
        return await this.leadRepository.getPendingLeads();
    }
}
