import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../../application/users/use-cases/registerUserUseCase';
import { RegisterUserDTO } from '../dtos/registerUserDto';
import { generateToken } from '../../../../infrastructure/middlewares/authMiddleware';
import { AuditService } from '../../../../core/users/services/auditService';

export class RegisterUserController {
    constructor(
        private registerUserUseCase: RegisterUserUseCase,
        private auditService: AuditService
    ) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userDTO: RegisterUserDTO = req.body;

        try {
            const user = await this.registerUserUseCase.execute(userDTO);
            const token = generateToken(user);

            // Registro en auditoría para la creación de un usuario
            await this.auditService.createAuditLog({
                id_usuario: user.id_usuario,
                accion: 'CREAR',
                entidad_afectada: 'usuarios',
                id_entidad: user.id_usuario,
            });

            res.status(201).json({ user, token });
        } catch (error) {
            next(error);
        }
    }
}
