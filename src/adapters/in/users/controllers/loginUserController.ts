import { Request, Response, NextFunction } from 'express';
import { LoginUserUseCase } from '../../../../application/users/use-cases/loginUserUseCase';
import { generateToken } from '../../../../infrastructure/middlewares/authMiddleware';
import bcrypt from 'bcrypt';

export class LoginUserController {
    constructor(private readonly loginUserUseCase: LoginUserUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction) {
        const { correo, contraseña } = req.body;

        try {
            const user = await this.loginUserUseCase.execute({ correo, contraseña });

            const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid password' });
                return; 
            }

            const token = generateToken(user);
            res.status(200).json({ message: `Login Exitoso como ${user.tipo}` });
        } catch (error) {
            next(error);
        }
    }
}
