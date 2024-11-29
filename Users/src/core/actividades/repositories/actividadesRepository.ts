import { ActividadesRepositoryPort } from '../../../application/actividades/ports/actividadesRepositoryPort';
import { Actividad } from '../domain/actividadEntity';

export class ActividadesRepository implements ActividadesRepositoryPort {
    constructor(
        private actividadesRepo: any
    ) { }

    async create(actividad: Actividad): Promise<Actividad> {
        return await this.actividadesRepo.save(actividad);
    }

    async getActividadesByDocente(id_docente: string): Promise<Actividad[]> {
        return await this.actividadesRepo.find({ where: { id_docente } });
    }

    async findById(id_actividad: string): Promise<Actividad> {
        return await this.actividadesRepo.findOne({ where: { id_actividad } });
    }
}
