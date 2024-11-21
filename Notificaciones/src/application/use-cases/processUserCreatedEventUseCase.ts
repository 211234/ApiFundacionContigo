import { notificationService } from '../../core/services/notificationService';
import { CreateTokenUseCase } from '../use-cases/createTokenUseCase';
import { TokenRepository } from '../../adapaters/in/repositories/tokenRepository';

export class ProcessUserCreatedEventUseCase {
    private createTokenUseCase: CreateTokenUseCase;

    constructor() {
        const tokenRepository = new TokenRepository();
        this.createTokenUseCase = new CreateTokenUseCase(tokenRepository, notificationService);
    }

    async execute(payload: any) {
        const { id_usuario, nombre, correo } = payload;

        const token = await this.createTokenUseCase.execute({
            id_usuario,
            nombre,
            correo,
            creadoPara: 'confirmacion',
        });

        const message = `Hola ${nombre}, tu código de verificación es: ${token.codigo}. 
        Usa este código para confirmar tu cuenta.`;

        await notificationService.sendEmail({
            to: correo,
            subject: 'Código de Verificación',
            message
        });
    }
}
