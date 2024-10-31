import { Request, Response, NextFunction } from 'express';
import { RegisterHijoUseCase } from '../../../../application/users/use-cases/registerHijoUseCase';
import { RegisterHijoDTO } from '../dtos/registerHijoDto';

export class RegisterHijoController {
    constructor(private registerNiñoUseCase: RegisterHijoUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const hijoDTO: RegisterHijoDTO = req.body;

        try {
            const hijo = await this.registerNiñoUseCase.execute(hijoDTO);
            res.status(201).json({ hijo });
        } catch (error) {
            next(error);
        }
    }
}
