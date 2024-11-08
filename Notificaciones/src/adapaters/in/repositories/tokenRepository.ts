import { IToken, TokenModel } from '../../../core/domain/entities/token';

export class TokenRepository {
    async createToken(tokenData: IToken): Promise<IToken> {
        return await tokenData.save(); // Utiliza el método `save` de Mongoose
    }

    async findTokenById(tokenId: string): Promise<IToken | null> {
        return await TokenModel.findById(tokenId);
    }

    async markTokenAsUsed(tokenId: string): Promise<void> {
        await TokenModel.findByIdAndUpdate(tokenId, { usado: true });
    }
}
