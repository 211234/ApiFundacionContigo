import { Request, Response, NextFunction } from 'express';
import { UpdateHijoUseCase } from '../../../../application/users/use-cases/updateHijoUseCase';
import { UpdateHijoDTO } from '../dtos/updateHijoDto';

export class UpdateHijoController {
    constructor(private readonly updateNiñoUseCase: UpdateHijoUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        try {
            const { id_hijo } = req.params;
            const updatedData = req.body;
            const updatedHijo = await this.updateNiñoUseCase.execute(id_hijo, updatedData);
            res.status(200).json(updatedHijo);
        } catch (error) {
            next(error);
        }
    }
}
