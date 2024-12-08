import { MedicamentoRepositoryPort } from '../ports/medicamentoRepositoryPort';

export class DeleteMedicamentoUseCase {
    constructor(
        private readonly medicamentoRepository: MedicamentoRepositoryPort
    ) { }

    async execute(id: string): Promise<boolean> {
        return await this.medicamentoRepository.delete(id);
    }
}
