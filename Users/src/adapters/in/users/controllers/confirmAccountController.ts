import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../../../core/users/services/tokenService';
import { UserService } from '../../../../core/users/services/servicesUser';

export class ConfirmAccountController {
    constructor(
        private tokenService: TokenService,
        private userService: UserService
    ) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { correo, codigo } = req.body;

        try {
            const tokenData = await this.tokenService.validateConfirmationToken(correo, codigo);

            if (!tokenData || !tokenData.correo) {
                res.status(400).json({ message: 'Código de confirmación inválido o expirado' });
                return;
            }

            await this.userService.updateVerificationStatus(correo, 'confirmado', true);

            res.status(200).json({ message: 'Cuenta confirmada exitosamente' });
        } catch (error) {
            next(error);
        }
    }
}
