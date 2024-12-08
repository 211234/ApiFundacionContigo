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
    
        console.log(`[DEBUG] Confirmación de cuenta para: ${correo}`);
        console.log(`[DEBUG] Código recibido: ${codigo}`);
    
        try {
            const tokenData = await this.tokenService.validateConfirmationToken(correo, codigo);
    
            // Asegurarse de imprimir tokenData de manera clara
            console.log(`[DEBUG] Resultado completo de validación token:`, JSON.stringify(tokenData));
    
            console.log(`[DEBUG] Token válido, procediendo con la confirmación`);
    
            console.log(`[DEBUG] Actualizando estado de verificación para: ${correo}`);
            await this.userService.updateVerificationStatus(correo, 'confirmado', true);
            console.log(`[DEBUG] Estado de verificación actualizado`);
    
            res.status(200).json({ message: 'Cuenta confirmada exitosamente' });
    
            return;
        } catch (error) {
            console.error('[ERROR] Error en confirmación de cuenta:', error);
            next(error);
        }
    }    
}
