import { Lead } from '../../../core/lead/domain/lead';

export interface LeadRepositoryPort {
    create(lead: Lead): Promise<void>;
    findById(id_lead: string): Promise<Lead | null>;
    getPendingLeads(): Promise<Lead[]>;
    confirmLead(id_lead: string): Promise<void>;
    rejectLead(id_lead: string): Promise<void>;
    deleteByEmail(correo: string): Promise<void>;
    confirmUser(userId: string): Promise<{ id_usuario: string; nombre: string; correo: string } | null>;
}
