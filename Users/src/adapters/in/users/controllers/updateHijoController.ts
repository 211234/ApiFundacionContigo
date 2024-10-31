import { Request, Response, NextFunction } from 'express';
import { UpdateNiñoUseCase } from '../../../../application/users/use-cases/updateHijoUseCase';
import { UpdateNiñoDTO } from '../dtos/updateHijoDto';

export class UpdateNiñoController {
    constructor(private readonly updateNiñoUseCase: UpdateNiñoUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        try {
            const { id_niño } = req.params;
            const updatedData = req.body;
            const updatedNiño = await this.updateNiñoUseCase.execute(id_niño, updatedData);
            res.status(200).json(updatedNiño);
        } catch (error) {
            next(error);
        }
    }
}
