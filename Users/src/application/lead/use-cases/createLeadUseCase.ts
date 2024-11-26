import { LeadRepository } from '../../../adapters/out/database/lead/leadRepository';
import { Lead } from '../../../core/lead/domain/lead';
import { v4 as uuidv4 } from 'uuid';

export class CreateLeadUseCase {
    constructor(private leadRepository: LeadRepository) { }

    async execute(data: { nombre: string; correo: string; telefono: string }): Promise<void> {
        const { nombre, correo, telefono } = data;

        // Crear la entidad Lead
        const lead: Lead = {
            id_lead: uuidv4(),
            nombre,
            correo,
            telefono,
            estado: 'pendiente',
            fecha_creacion: new Date()
        };

        // Guardar en el repositorio
        await this.leadRepository.create(lead);
    }
}
