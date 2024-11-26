import { MedicamentoRepositoryPort } from '../ports/medicamentoRepositoryPort';
import { Medicamento } from '../../../core/medicamentos/domain/medicamentoEntity';

export class GetAllMedicamentoUseCase {
    constructor(
        private readonly medicamentoRepository: MedicamentoRepositoryPort
    ) { }

    async execute(): Promise<Medicamento[]> {
        return await this.medicamentoRepository.getAll();
    }
}