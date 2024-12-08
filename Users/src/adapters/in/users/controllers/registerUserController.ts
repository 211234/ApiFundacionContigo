import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../../application/users/use-cases/registerUserUseCase';
import { RegisterUserDTO } from '../dtos/registerUserDto';
import { AuditService } from '../../../../core/users/services/auditService';
import { rabbitMQConfig, RabbitMQConnection } from '../../../../infrastructure/config/rabbitMQ';

export class RegisterUserController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private auditService: AuditService
    ) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDTO: RegisterUserDTO = req.body;

        try {
            const user = await this.registerUserUseCase.execute(userDTO);

            // Registro en auditoría para la creación de un usuario
            await this.auditService.createAuditLog({
                id_usuario: user.id_usuario,
                accion: 'CREAR',
                entidad_afectada: 'usuarios',
                id_entidad: user.id_usuario,
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
                                id_usuario: user.id_usuario,
                                nombre: user.nombre,
                                correo: user.correo,
                            },
                        })
                    )
                );
                console.log('Evento USER_CREATED publicado en RabbitMQ');
            } catch (rabbitError) {
                console.error('Error al publicar el evento en RabbitMQ:', rabbitError);
                // No interrumpir el registro del usuario por errores en RabbitMQ
            }

            res.status(201).json({ message: 'Usuario registrado. Verifique su correo electrónico para confirmar la cuenta.', user });
        } catch (error) {
            next(error);
        }
    }
}
