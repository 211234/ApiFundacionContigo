import { ActividadesRepositoryPort } from '../ports/actividadesRepositoryPort';
import { Actividad } from '../../../core/actividades/domain/actividadEntity';
import { v4 as uuidv4 } from 'uuid';

export class CreateActividadUseCase {
    constructor(private readonly actividadesRepository: ActividadesRepositoryPort) { }

    async execute(data: Omit<Actividad, 'id_actividad'>): Promise<Actividad> {
        const id_actividad = uuidv4();
        const actividad = new Actividad(
            id_actividad,
            data.id_docente,
            data.nombre,
            data.instrucciones,
            data.multimedia_url
        );
        return await this.actividadesRepository.create(actividad);
    }
}
