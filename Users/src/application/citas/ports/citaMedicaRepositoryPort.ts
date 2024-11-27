import { CitaMedica } from '../../../core/citas/domain/citaMedicaEntity';

export interface CitaMedicaRepositoryPort {
    createCita(cita: CitaMedica): Promise<CitaMedica>;
    getCitasByUserId(id_usuario: string): Promise<CitaMedica[]>;
    updateCita(cita: CitaMedica): Promise<void>;
    deleteCita(id_cita: string): Promise<void>;
}
