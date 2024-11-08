import { Request, Response } from 'express';
import { CreateTokenUseCase } from '../../../application/use-cases/createTokenUseCase';

export class TokenController {
    private createTokenUseCase: CreateTokenUseCase;

    constructor() {
        this.createTokenUseCase = new CreateTokenUseCase();
    }

    public async createToken(req: Request, res: Response): Promise<void> {
        const { id_usuario, nombre, correo, creadoPara } = req.body;
        try {
            const token = await this.createTokenUseCase.execute({ id_usuario, nombre, correo, creadoPara });
            res.status(201).json({ message: 'Token creado exitosamente', token });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear token', error });
        }
    }
}
