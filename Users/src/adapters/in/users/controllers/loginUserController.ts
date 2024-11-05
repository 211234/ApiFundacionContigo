import { Request, Response, NextFunction } from 'express';
import { LoginUserUseCase } from '../../../../application/users/use-cases/loginUserUseCase';
import { UserAuditUseCase } from '../../../../application/users/use-cases/userAuditUseCase';
import { generateToken } from '../../../../infrastructure/middlewares/authMiddleware';
import bcrypt from 'bcrypt';

export class LoginUserController {
    constructor(
        private readonly loginUserUseCase: LoginUserUseCase,
        private readonly userAuditUseCase: UserAuditUseCase
    ) {}

    async handle(req: Request, res: Response, next: NextFunction) {
        const { correo, password } = req.body;

        try {
            const user = await this.loginUserUseCase.execute({ correo, password });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid password' });
                return; 
            }

            const token = generateToken(user);
            
            // Registro de auditoría para el inicio de sesión
            await this.userAuditUseCase.loginUser(user.id_usuario);

            res.status(200).json({ 
                message: `Login Exitoso como ${user.tipo}`, 
                token 
            });
        } catch (error) {
            next(error);
        }
    }
}
