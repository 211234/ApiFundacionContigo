import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../../application/users/use-cases/registerUserUseCase';
import { RegisterUserDTO } from '../dtos/registerUserDto';
import { generateToken } from '../../../../infrastructure/middlewares/authMiddleware';

export class RegisterUserController {
    constructor(private registerUserUseCase: RegisterUserUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDTO: RegisterUserDTO = req.body;

        try {
            const user = await this.registerUserUseCase.execute(userDTO);
            const token = generateToken(user);
            res.status(201).json({ user, token });
        } catch (error) {
            next(error);
        }
    }
}
