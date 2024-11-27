import { MedicamentoRepositoryPort } from '../../../application/medicamentos/ports/medicamentoRepositoryPort';
import { Medicamento } from '../domain/medicamentoEntity';
import { CreateMedicamentoDTO } from '../../../adapters/in/medicamentos/dtos/createMedicamentoDto';
import { UpdateMedicamentoDTO } from '../../../adapters/in/medicamentos/dtos/updateMedicamentoDto';
import { AuditService } from '../../users/services/auditService';
import { v4 as uuidv4 } from 'uuid';

export class MedicamentoService {
    constructor(
        private medicamentoRepository: MedicamentoRepositoryPort,
        private auditService: AuditService
    ) { }

    async createMedicamento(medicamentoData: CreateMedicamentoDTO): Promise<Medicamento> {
        const id_medicamento = uuidv4();

        // Crear el objeto Medicamento
        const medicamento: Medicamento = {
            id_medicamento,
            ...medicamentoData
        };

        // Guardar en el repositorio
        const savedMedicamento = await this.medicamentoRepository.create(medicamento);

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: medicamentoData.id_usuario,
            accion: 'CREAR',
            entidad_afectada: 'medicamentos',
            id_entidad: savedMedicamento.id_medicamento
        });

        return savedMedicamento;
    }

    async getAllMedicamentos(): Promise<Medicamento[]> {
        return await this.medicamentoRepository.getAll();
    }

    async getMedicamentoById(id: string): Promise<Medicamento | null> {
        return await this.medicamentoRepository.findById(id);
    }

    async updateMedicamento(id: string, medicamentoData: UpdateMedicamentoDTO): Promise<Medicamento | null> {
        const updatedMedicamento = await this.medicamentoRepository.update(id, medicamentoData);

        if (!updatedMedicamento) {
            throw new Error('Medicamento not found');
        }

        // Registrar en auditoría
        await this.auditService.createAuditLog({
            id_usuario: medicamentoData.id_usuario,
            accion: 'ACTUALIZAR',
            entidad_afectada: 'medicamentos',
            id_entidad: id
        });

        return updatedMedicamento;
    }

    async deleteMedicamento(id: string): Promise<boolean> {
        const deleted = await this.medicamentoRepository.delete(id);

        if (deleted) {
            // Registrar en auditoría
            await this.auditService.createAuditLog({
                id_usuario: id, // Ajusta esto según el contexto de quién realiza la acción
                accion: 'BORRAR',
                entidad_afectada: 'medicamentos',
                id_entidad: id
            });
        }

        return deleted;
    }
}
