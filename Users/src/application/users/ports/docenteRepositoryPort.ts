import { UpdateDocenteDTO } from '../../../adapters/in/users/dtos/updateDocenteDto';    
import { Docente } from '../../../core/users/domain/docenteEntity';

export interface DocenteRepositoryPort {
    createDocente(docente: Docente): Promise<Docente>;
    findById(id_docente: string): Promise<Docente | null>;
    update(id_docente: string, updatedData: any): Promise<Docente | null>;
    delete(id_docente: string): Promise<void>;
    getAllDocentes(): Promise<Docente[]>;
}
