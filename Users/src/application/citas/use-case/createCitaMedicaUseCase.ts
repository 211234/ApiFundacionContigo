import { CitaMedica } from '../../../core/citas/domain/citaMedicaEntity';
import { CitaMedicaRepositoryPort } from '../ports/citaMedicaRepositoryPort';
import { v4 as uuidv4 } from 'uuid';

export class CreateCitaMedicaUseCase {
    constructor(private readonly citaMedicaRepository: CitaMedicaRepositoryPort) { }

    async execute(data: Omit<CitaMedica, 'id_cita'>): Promise<CitaMedica> {
        const id_cita = uuidv4();
        const cita = new CitaMedica(id_cita, data.id_usuario, data.fecha_cita, data.observaciones, data.recordatorio);
        return await this.citaMedicaRepository.createCita(cita);
    }
}