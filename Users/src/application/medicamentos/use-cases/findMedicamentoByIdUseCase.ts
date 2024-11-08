import { MedicamentoRepositoryPort } from '../ports/medicamentoRepositoryPort';
import { Medicamento } from '../../../core/medicamentos/domain/medicamentoEntity';

export class GetMedicamentoUseCase {
    constructor(
        private readonly medicamentoRepository: MedicamentoRepositoryPort
    ) { }

    async execute(id: string): Promise<Medicamento | null> {
        return await this.medicamentoRepository.findById(id);
    }
}
