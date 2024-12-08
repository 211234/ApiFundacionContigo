import { CitaMedica } from '../../../core/citas/domain/citaMedicaEntity';
import { CitaRepository } from '../repositories/citaRepository';
import { AuditService } from '../../users/services/auditService';

export class CitaService {
    constructor(
        private citaRepository: CitaRepository,
        private auditService: AuditService
    ) { }

    async createCita(cita: CitaMedica): Promise<void> {
        await this.citaRepository.createCita(cita);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: cita.id_usuario,
            accion: 'CREAR',
            entidad_afectada: 'citas_medicas',
            id_entidad: cita.id_cita
        });
    }

    async updateCita(cita: CitaMedica): Promise<void> {
        await this.citaRepository.updateCita(cita.id_cita, cita);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: cita.id_usuario,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'citas_medicas',
            id_entidad: cita.id_cita
        });
    }

    async deleteCita(id_cita: string, id_usuario: string): Promise<void> {
        await this.citaRepository.deleteCita(id_cita);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: id_usuario,
            accion: 'BORRAR',
            entidad_afectada: 'citas_medicas',
            id_entidad: id_cita
        });
    }
}
