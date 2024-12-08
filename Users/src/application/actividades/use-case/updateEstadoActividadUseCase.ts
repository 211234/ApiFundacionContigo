import { EstadoActividadesRepositoryPort } from '../ports/estadoActividadesRepositoryPort';

export class UpdateEstadoActividadUseCase {
    constructor(private readonly estadoActividadesRepository: EstadoActividadesRepositoryPort) { }

    async execute(id_estado: string, data: { evidencia_url: string; fecha_completado: Date; tiempo_minutos: number }): Promise<void> {
        console.log('Datos enviados al repositorio para actualización:', {
            id_estado,
            ...data,
        });

        await this.estadoActividadesRepository.update(id_estado, {
            ...data,
            estado: true, // Marcar como completado
        });
    }
}
