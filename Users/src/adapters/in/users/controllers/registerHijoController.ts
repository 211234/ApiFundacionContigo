import { Request, Response, NextFunction } from 'express';
import { RegisterNiñoUseCase } from '../../../../application/users/use-cases/registerHijoUseCase';
import { RegisterNiñoDTO } from '../dtos/registerHijoDto';

export class RegisterNiñoController {
    constructor(private registerNiñoUseCase: RegisterNiñoUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const niñoDTO: RegisterNiñoDTO = req.body;

        try {
            const niño = await this.registerNiñoUseCase.execute(niñoDTO);
            res.status(201).json({ niño });
        } catch (error) {
            next(error);
        }
    }
}
