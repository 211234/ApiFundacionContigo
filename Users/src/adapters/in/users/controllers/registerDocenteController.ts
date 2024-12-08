import { Request, Response, NextFunction } from 'express';
import { RegisterDocenteUseCase } from '../../../../application/users/use-cases/registerDocenteUseCase';
import { RegisterDocenteDTO } from '../dtos/registerDocenteDto';
import { AuditService } from '../../../../core/users/services/auditService';
import { rabbitMQConfig, RabbitMQConnection } from '../../../../infrastructure/config/rabbitMQ';

export class RegisterDocenteController {
    constructor(
        private registerDocenteUseCase: RegisterDocenteUseCase,
        private auditService: AuditService
    ) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const docenteDTO: RegisterDocenteDTO = req.body;

            // Ejecutar el caso de uso para registrar un docente
            const docente = await this.registerDocenteUseCase.execute(docenteDTO);

            // Registrar acción en la auditoría
            await this.auditService.createAuditLog({
                id_usuario: docenteDTO.id_usuario,
                accion: 'CREAR',
                entidad_afectada: 'docentes',
                id_entidad: docente.id_docente,
            });

            // Publicar evento en RabbitMQ con manejo de errores
            try {
                const channel = RabbitMQConnection.getChannel();
                channel.publish(
                    rabbitMQConfig.notificationExchange,
                    '',
                    Buffer.from(
                        JSON.stringify({
                            type: 'USER_CREATED',
                            payload: {
                                id_usuario: docente.id_usuario,
                                nombre: docenteDTO.nombre,
                                correo: docenteDTO.correo,
                            },
                        })
                    )
                );
                console.log('Evento USER_CREATED publicado en RabbitMQ');
            } catch (rabbitError) {
                console.error('Error al publicar el evento en RabbitMQ:', rabbitError);
                // No interrumpir el registro del docente por errores en RabbitMQ
            }

            res.status(201).json(docente);
        } catch (error) {
            next(error);
        }
    }
}
