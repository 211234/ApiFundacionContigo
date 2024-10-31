import { Request, Response, NextFunction } from 'express';
import { UpdateUserUseCase } from '../../../../application/users/use-cases/updateUserUseCase';
import { UpdateUserDTO } from '../dtos/updateUserDto';

export class UpdateUserController {
    constructor(private updateUserUseCase: UpdateUserUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id_usuario } = req.params;
        const updateData: UpdateUserDTO = req.body;

        try {
            const updatedUser = await this.updateUserUseCase.execute(id_usuario, updateData);
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
}
