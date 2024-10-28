import { Docente } from '../../../core/users/domain/docenteEntity';

export interface DocenteRepositoryPort {
    createDocente(docente: Docente): Promise<Docente>;
}
