import { MedicamentoRepositoryPort } from '../ports/medicamentoRepositoryPort';
import { CreateMedicamentoDTO } from '../../../adapters/in/medicamentos/dtos/createMedicamentoDto';
import { Medicamento } from '../../../core/medicamentos/domain/medicamentoEntity';

export class UpdateMedicamentoUseCase {
    constructor(
        private readonly medicamentoRepository: MedicamentoRepositoryPort
    ) { }

    async execute(id: string, medicamentoData: Partial<CreateMedicamentoDTO>): Promise<Medicamento | null> {
        return await this.medicamentoRepository.update(id, medicamentoData);
    }
}
