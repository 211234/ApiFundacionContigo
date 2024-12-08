import { Repository, DataSource } from 'typeorm';
import { CitaMedica } from '../../../core/citas/domain/citaMedicaEntity';
import { UpdateCitaDTO } from '../../../adapters/in/citas/dtos/updateCitaDto';
import { CreateCitaDTO } from '../../../adapters/in/citas/dtos/citaDto';

export class CitaRepository {
    private citaRepo: Repository<CitaMedica>;

    constructor(dataSource: DataSource) {
        this.citaRepo = dataSource.getRepository(CitaMedica);
    }

    // Crear una nueva cita médica
    async createCita(createCitaDto: CreateCitaDTO): Promise<CitaMedica> {
        const nuevaCita = this.citaRepo.create(createCitaDto);
        return await this.citaRepo.save(nuevaCita);
    }

    // Obtener todas las citas médicas de un usuario por su ID
    async getCitasByUserId(id_usuario: string): Promise<CitaMedica[]> {
        return await this.citaRepo.find({ where: { id_usuario } });
    }

    // Actualizar una cita médica existente
    async updateCita(id_cita: string, updateCitaDto: UpdateCitaDTO): Promise<CitaMedica> {
        await this.citaRepo.update(id_cita, updateCitaDto);
        const updatedCita = await this.citaRepo.findOne({ where: { id_cita } });
        if (!updatedCita) {
            throw new Error('Cita no encontrada después de la actualización');
        }
        return updatedCita;
    }

    // Eliminar una cita médica
    async deleteCita(id_cita: string): Promise<void> {
        const result = await this.citaRepo.delete(id_cita);
        if (result.affected === 0) {
            throw new Error('Cita no encontrada o ya eliminada');
        }
    }
}
