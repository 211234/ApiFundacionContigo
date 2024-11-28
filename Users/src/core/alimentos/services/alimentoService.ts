import { Alimento } from '../domain/alimentoEntity';
import { AlimentoRepositoryPort } from '../../../application/alimentos/ports/alimentoRepositoryPort';
import { AuditService } from '../../users/services/auditService';

export class AlimentoService {
    constructor(
        private readonly alimentoRepository: AlimentoRepositoryPort,
        private readonly auditService: AuditService
    ) { }

    async createAlimento(alimento: Alimento): Promise<void> {
        await this.alimentoRepository.createAlimento(alimento);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: alimento.id_usuario,
            accion: 'CREAR',
            entidad_afectada: 'alimentos',
            id_entidad: alimento.id_alimento
        });
    }

    async getAlimentosByUserId(id_usuario: string): Promise<Alimento[]> {
        return await this.alimentoRepository.getAlimentosByUserId(id_usuario);
    }

    async updateAlimento(id_alimento: string, alimento: Alimento): Promise<void> {
        await this.alimentoRepository.updateAlimento(id_alimento, alimento);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: alimento.id_usuario,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'alimentos',
            id_entidad: id_alimento
        });
    }

    async deleteAlimento(id_alimento: string): Promise<void> {
        await this.alimentoRepository.deleteAlimento(id_alimento);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: id_alimento,
            accion: 'BORRAR',
            entidad_afectada: 'alimentos',
            id_entidad: id_alimento
        });
    }
}
