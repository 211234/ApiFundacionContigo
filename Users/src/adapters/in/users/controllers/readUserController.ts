import { Request, Response, NextFunction } from 'express';
import { ReadUserUseCase } from '../../../../application/users/use-cases/findUserByIdUseCase';

export class ReadUserController {
    constructor(private readUserUseCase: ReadUserUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id_usuario } = req.params;

        try {
            const user = await this.readUserUseCase.execute(id_usuario);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
}
