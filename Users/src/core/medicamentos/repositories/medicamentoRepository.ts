import { MedicamentoRepositoryPort } from '../../../application/medicamentos/ports/medicamentoRepositoryPort';
import { Medicamento } from '../../../core/medicamentos/domain/medicamentoEntity';
import { UpdateMedicamentoDTO } from '../../../adapters/in/medicamentos/dtos/updateMedicamentoDto';

export class MedicamentoRepositoryImpl implements MedicamentoRepositoryPort {
  constructor(
    private medicamentoRepo: any
  ) { }

  async findById(id_medicamento: string): Promise<Medicamento | null> {
    return await this.medicamentoRepo.findOne({ where: { id_medicamento } });
  }

  async getAll(): Promise<Medicamento[]> {
    return await this.medicamentoRepo.find();
  }

  async create(medicamento: Medicamento): Promise<Medicamento> {
    return await this.medicamentoRepo.save(medicamento);
  }

  async update(id_medicamento: string, updateData: UpdateMedicamentoDTO): Promise<Medicamento | null> {
    await this.medicamentoRepo.update(id_medicamento, updateData);
    const updatedMedicamento = await this.findById(id_medicamento);
    if (!updatedMedicamento) {
      throw new Error('Medicamento not found after update');
    }
    return updatedMedicamento;
  }

  async delete(id_medicamento: string): Promise<boolean> {
    const result = await this.medicamentoRepo.delete(id_medicamento);
    return result.affected > 0;
  }
}
