import { Request, Response } from 'express';
import { CreateTokenUseCase } from '../../../application/use-cases/createTokenUseCase';
import { TokenRepository } from '../repositories/tokenRepository';
import { NotificationService } from '../../../core/services/notificationService';
import { GmailService } from '../../out/email/gmailService';
import { RabbitMQPublisher } from '../../out/queue/rabbitMQPublisher';
import { UserRepository } from '../../../../../Users/src/adapters/out/database/users/userRepository';

export class TokenController {
    private createTokenUseCase: CreateTokenUseCase;
    private gmailService: GmailService;
    private eventPublisher: RabbitMQPublisher;
    private userRepository: UserRepository;

    constructor() {
        const tokenRepository = new TokenRepository();
        const notificationService = new NotificationService();
        this.gmailService = new GmailService();
        this.eventPublisher = new RabbitMQPublisher();
        this.createTokenUseCase = new CreateTokenUseCase(tokenRepository, notificationService);
        this.userRepository = new UserRepository();
    }

    // Método para crear un token y enviar el correo de confirmación
    public async createToken(req: Request, res: Response): Promise<void> {
        const { id_usuario, nombre, correo, creadoPara } = req.body;

        try {
            const token = await this.createTokenUseCase.execute({ id_usuario, nombre, correo, creadoPara });
            await this.gmailService.sendConfirmationEmail(correo, nombre, token.codigo);

            res.status(201).json({
                message: 'Token creado y correo de confirmación enviado exitosamente',
                codigo: token.codigo
            });
        } catch (error) {
            console.error('Error al crear token:', error);
            res.status(500).json({ message: 'Error al crear token', error });
        }
    }

    // Método para confirmar la cuenta del usuario
    public async confirmAccount(req: Request, res: Response): Promise<void> {
        const { id_usuario, correo, codigo } = req.body;
    
        if ((!id_usuario && !correo) || !codigo) {
            res.status(400).json({ message: 'El id_usuario o el correo, y el código son obligatorios' });
            return;
        }
    
        try {
            // Buscar el token usando correo o id_usuario y código
            const tokenData = correo
                ? await this.createTokenUseCase.getTokenByCorreoAndCodigo(correo, codigo)
                : await this.createTokenUseCase.getTokenByUsuarioAndCodigo(id_usuario, codigo);
    
            if (!tokenData) {
                res.status(404).json({ message: 'Token no encontrado' });
                return;
            }
    
            if (tokenData.expirado || tokenData.usado) {
                res.status(400).json({ message: 'Token inválido o expirado' });
                return;
            }
    
            // Marcar el token como usado
            await this.createTokenUseCase.markTokenAsUsed(tokenData._id as string);
    
            // Publicar el evento de usuario confirmado
            await this.eventPublisher.publish('USER_CONFIRMED', { id_usuario: tokenData.id_usuario });
    
            // Actualizar el estado de verificación del usuario
            await this.userRepository.updateVerificationStatus(tokenData.id_usuario, 'confirmado');
    
            // Enviar un correo de bienvenida
            await this.gmailService.sendWelcomeEmail(correo || '', tokenData.nombre);
    
            res.status(200).json({ message: 'Cuenta confirmada exitosamente' });
        } catch (error) {
            console.error('Error al confirmar cuenta:', error);
            res.status(500).json({ message: 'Error al confirmar cuenta' });
        }
    }    

}
