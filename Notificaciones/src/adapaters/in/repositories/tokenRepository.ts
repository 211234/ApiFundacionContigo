import { IToken, TokenModel } from '../../../core/domain/entities/token';

export class TokenRepository {
    async createToken(tokenData: IToken): Promise<IToken> {
        return await tokenData.save();
    }

    async findTokenByCorreoAndCodigo(correo: string, codigo: string): Promise<IToken | null> {
        return await TokenModel.findOne({ correo, codigo });
    }

    async markTokenAsUsed(tokenId: string): Promise<void> {
        await TokenModel.findByIdAndUpdate(tokenId, { usado: true });
    }
}
