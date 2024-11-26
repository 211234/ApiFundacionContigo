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
    
            // Actualiza el estado utilizando el correo
            await this.userService.updateVerificationStatus(correo, 'confirmado', true);
    
            // Eliminar el lead asociado al correo confirmado
            await this.userService.deleteLeadByEmail(correo);
    
            res.status(200).json({ message: 'Cuenta confirmada y lead eliminado exitosamente' });
        } catch (error) {
            console.error('Error al confirmar cuenta:', error);
            next(error);
        }
    }
}
