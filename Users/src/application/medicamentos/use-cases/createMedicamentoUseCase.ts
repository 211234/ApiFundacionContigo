import { MedicamentoRepositoryPort } from '../ports/medicamentoRepositoryPort';
import { CreateMedicamentoDTO } from '../../../adapters/in/medicamentos/dtos/createMedicamentoDto';
import { Medicamento } from '../../../core/medicamentos/domain/medicamentoEntity';

export class CreateMedicamentoUseCase {
    constructor(
        private readonly medicamentoRepository: MedicamentoRepositoryPort
    ) { }

    async execute(medicamentoData: CreateMedicamentoDTO): Promise<Medicamento> {
        return await this.medicamentoRepository.create(medicamentoData);
    }
}
