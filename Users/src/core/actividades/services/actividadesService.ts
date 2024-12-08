import { ActividadesRepositoryPort } from '../../../application/actividades/ports/actividadesRepositoryPort';
import { EstadoActividadesRepositoryPort } from '../../../application/actividades/ports/estadoActividadesRepositoryPort';
import { Actividad } from '../domain/actividadEntity';
import { EstadoActividad } from '../domain/estadoActividadEntity';
import { EmailService } from '../../../adapters/out/services/emailService';

export class ActividadesService {
    private readonly emailService: EmailService;

    constructor(
        private readonly actividadesRepository: ActividadesRepositoryPort,
        private readonly estadoActividadesRepository: EstadoActividadesRepositoryPort
    ) {
        this.emailService = new EmailService(); // Inyección de dependencia manual
    }

    async createActividad(actividad: Actividad): Promise<Actividad> {
        return await this.actividadesRepository.create(actividad);
    }

    async assignActividad(id_actividad: string, usuarios: string[]): Promise<void> {
        for (const id_usuario of usuarios) {
            const estadoActividad = new EstadoActividad(
                id_usuario,
                id_actividad,
                id_usuario,
                '', // URL vacía, se llenará cuando suban la evidencia
                new Date(), // Fecha de asignación
                0, // Tiempo inicial 0
                false // Pendiente
            );
            await this.estadoActividadesRepository.create(estadoActividad);
    
            // Enviar correo
            const usuarioInfo = await this.estadoActividadesRepository.getUsuarioInfo(id_usuario);
            if (usuarioInfo && usuarioInfo.correo) {
                await this.emailService.sendNotificationEmail(usuarioInfo.correo, id_actividad);
            }
        }
    }         

    async getActividadesByUsuario(id_usuario: string): Promise<EstadoActividad[]> {
        return await this.estadoActividadesRepository.getActividadesByUsuario(id_usuario);
    }
}
