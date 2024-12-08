import { EstadoActividadesRepositoryPort } from '../../../application/actividades/ports/estadoActividadesRepositoryPort';
import { EstadoActividad } from '../domain/estadoActividadEntity';

export class EstadoActividadesRepository implements EstadoActividadesRepositoryPort {
    constructor(
        private estadoActividadesRepo: any
    ) { }

    async create(estadoActividad: EstadoActividad): Promise<void> {
        await this.estadoActividadesRepo.save(estadoActividad);
    }

    async getActividadesByUsuario(id_usuario: string): Promise<any[]> {
        return await this.estadoActividadesRepo.find({ where: { id_usuario } });
    }

    async getUsuarioInfo(id_usuario: string): Promise<any> {
        return await this.estadoActividadesRepo.findOne({ where: { id_usuario } });
    }

    async update(id_estado: string, data: { evidencia_url: string; fecha_completado: Date; tiempo_minutos: number; estado: boolean }): Promise<void> {
        await this.estadoActividadesRepo.update(id_estado, data);
    }
}
