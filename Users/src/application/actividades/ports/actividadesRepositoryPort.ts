import { Actividad } from '../../../core/actividades/domain/actividadEntity';

export interface ActividadesRepositoryPort {
    create(actividad: Actividad): Promise<Actividad>;
    getActividadesByDocente(id_docente: string): Promise<Actividad[]>;
}
