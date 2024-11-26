import { TokenRepository } from '../../adapaters/in/repositories/tokenRepository';
import { NotificationService } from '../../core/services/notificationService';
import { CreateTokenDTO } from '../../adapaters/in/dtos/tokenDTO';
import { IToken, TokenModel } from '../../core/domain/entities/token';

export class CreateTokenUseCase {
    private tokenRepository: TokenRepository;
    private notificationService: NotificationService;

    constructor(tokenRepository: TokenRepository, notificationService: NotificationService) {
        this.tokenRepository = tokenRepository;
        this.notificationService = notificationService;
    }

    private generateFourDigitCode(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Método para crear un nuevo token
    async execute(data: CreateTokenDTO): Promise<IToken> {
        const expirationTime = parseInt(process.env.TOKEN_EXPIRATION_IN_MINUTES || '60', 10);
        const expiresAt = new Date(Date.now() + expirationTime * 60000);

        const codigo = this.generateFourDigitCode();

        const tokenData = new TokenModel({
            ...data,
            fecha_creacion: new Date(),
            usado: false,
            expirado: false,
            expiresAt,
            codigo,
        });

        const token = await this.tokenRepository.createToken(tokenData);

        // Enviar el código de verificación al correo
        const subject = data.creadoPara === 'confirmacion'
            ? 'Código de Confirmación de Cuenta'
            : 'Código para Recuperación de Contraseña';
        const message = `Hola ${data.nombre}, tu código es: ${codigo}. Este código expirará en ${expirationTime} minutos.`;

        await this.notificationService.sendEmail({
            to: data.correo,
            subject,
            message,
        });

        return token;
    }

    async verifyToken(codigo: string, correo: string): Promise<boolean> {
        const token = await this.tokenRepository.findTokenByCorreoAndCodigo(correo, codigo);

        if (!token) {
            return false; // Token no encontrado
        }

        const ahora = new Date();
        if (token.usado || token.expiresAt < ahora) {
            return false; // Token ya usado o expirado
        }

        // Marcar el token como usado
        await this.tokenRepository.markTokenAsUsed(token._id as string);
        return true; // Token válido
    }

    // Método para buscar un token usando el correo y el código
    async getTokenByCorreoAndCodigo(correo: string, codigo: string): Promise<IToken | null> {
        return await this.tokenRepository.findTokenByCorreoAndCodigo(correo, codigo);
    }

    // Método para marcar un token como usado
    async markTokenAsUsed(tokenId: string): Promise<void> {
        await this.tokenRepository.markTokenAsUsed(tokenId);
    }

    public async getTokenByUsuarioAndCodigo(id_usuario: string, codigo: string) {
        return await this.tokenRepository.findByUsuarioAndCodigo(id_usuario, codigo);
    }    
}
