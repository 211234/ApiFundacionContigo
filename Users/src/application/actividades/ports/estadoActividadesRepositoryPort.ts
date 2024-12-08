import { EstadoActividad } from '../../../core/actividades/domain/estadoActividadEntity';

export interface EstadoActividadesRepositoryPort {
    create(estadoActividad: EstadoActividad): Promise<void>;
    getActividadesByUsuario(id_usuario: string): Promise<any[]>;
    getUsuarioInfo(id_usuario: string): Promise<any>;
    update(id_estado: string, data: { evidencia_url: string; fecha_completado: Date; tiempo_minutos: number; estado: boolean }): Promise<void>;
}
