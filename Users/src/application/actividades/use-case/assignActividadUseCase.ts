import { EstadoActividadesRepositoryPort } from '../ports/estadoActividadesRepositoryPort';
import { UserRepositoryPort } from '../../users/ports/userRepositoryPort';
import { EmailService } from '../../../adapters/out/services/emailService';
import { v4 as uuidv4 } from 'uuid';
import { EstadoActividad } from '../../../core/actividades/domain/estadoActividadEntity';
import { ActividadesRepositoryPort } from '../../../application/actividades/ports/actividadesRepositoryPort';

export class AssignActividadUseCase {
    constructor(
        private readonly estadoActividadesRepository: EstadoActividadesRepositoryPort,
        private readonly userRepository: UserRepositoryPort,
        private readonly emailService: EmailService,
        private readonly actividadesRepository: ActividadesRepositoryPort // Asegúrate de que este repositorio esté incluido aquí
    ) {}

    async execute(id_actividad: string, usuarios: string[]): Promise<void> {
        // Obtener los detalles de la actividad usando findById
        const actividad = await this.actividadesRepository.findById(id_actividad);
        const nombre_actividad = actividad ? actividad.nombre : 'Actividad no encontrada';

        // Asignar actividad a los usuarios
        for (const id_usuario of usuarios) {
            const usuario = await this.userRepository.findById(id_usuario);
            if (!usuario) {
                throw new Error(`El usuario con ID ${id_usuario} no existe.`);
            }

            const id_estado = uuidv4();
            const estadoActividad = new EstadoActividad(
                id_estado,
                id_actividad,
                id_usuario,
                '', // URL vacía, se llenará cuando suban la evidencia
                new Date(), // Fecha de asignación
                0, // Tiempo inicial 0
                false // Pendiente
            );

            // Crear estado de actividad
            await this.estadoActividadesRepository.create(estadoActividad);

            // Enviar correo al usuario con el nombre de la actividad
            if (usuario.correo) {
                await this.emailService.sendNotificationEmail(
                    usuario.correo,
                    nombre_actividad // Pasamos solo el nombre de la actividad
                );
            }
        }
    }
}
