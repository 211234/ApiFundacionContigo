import { Request, Response, NextFunction } from 'express';
import { DeleteUserUseCase } from '../../../../application/users/use-cases/deleteUserUseCase';

export class DeleteUserController {
    constructor(private deleteUserUseCase: DeleteUserUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id_usuario } = req.params;

        try {
            await this.deleteUserUseCase.execute(id_usuario);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Unknown error' });
            }
        }
    }
}
