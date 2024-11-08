import { TokenRepository } from '../../adapaters/in/repositories/tokenRepository';
import { CreateTokenDTO } from '../../adapaters/in/dtos/tokenDTO';
import { IToken, TokenModel  } from '../../core/domain/entities/token';

export class CreateTokenUseCase {
    private tokenRepository: TokenRepository;

    constructor() {
        this.tokenRepository = new TokenRepository();
    }

    async execute(data: CreateTokenDTO): Promise<IToken> {
        // Crear una instancia del modelo TokenModel
        const tokenData = new TokenModel({
            ...data,
            fecha_creacion: new Date(),
            usado: false,
            expirado: false
        });

        // Guardar el token usando el repositorio
        return await this.tokenRepository.createToken(tokenData);
    }
}