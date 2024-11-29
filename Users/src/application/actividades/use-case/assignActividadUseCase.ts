import { EstadoActividadesRepositoryPort } from '../ports/estadoActividadesRepositoryPort';
import { UserRepositoryPort } from '../../users/ports/userRepositoryPort';
import { EmailService } from '../../../adapters/out/services/emailService';
import { v4 as uuidv4 } from 'uuid';
import { EstadoActividad } from '../../../core/actividades/domain/estadoActividadEntity';

export class AssignActividadUseCase {
    constructor(
        private readonly estadoActividadesRepository: EstadoActividadesRepositoryPort,
        private readonly userRepository: UserRepositoryPort, // Agregar repositorio de usuarios
        private readonly emailService: EmailService
    ) {}

    async execute(id_actividad: string, usuarios: string[]): Promise<void> {
        for (const id_usuario of usuarios) {
            // Verificar si el usuario existe
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

            // Enviar correo si el usuario tiene correo registrado
            if (usuario.correo) {
                await this.emailService.sendNotificationEmail(
                    usuario.correo,
                    id_actividad
                );
            }
        }
    }
}
