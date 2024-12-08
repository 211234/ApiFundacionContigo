import { CreateMedicamentoDTO } from '../../../adapters/in/medicamentos/dtos/createMedicamentoDto';
import { Medicamento } from '../../../core/medicamentos/domain/medicamentoEntity';

export interface MedicamentoRepositoryPort {
    create(medicamento: CreateMedicamentoDTO): Promise<Medicamento>;
    findById(id: string): Promise<Medicamento | null>;
    getAll(): Promise<Medicamento[]>;
    update(id: string, medicamento: Partial<CreateMedicamentoDTO>): Promise<Medicamento | null>;
    delete(id: string): Promise<boolean>;
}
