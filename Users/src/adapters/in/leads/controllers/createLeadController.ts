import { Request, Response, NextFunction } from 'express';
import { CreateLeadUseCase } from '../../../../application/lead/use-cases/createLeadUseCase';

export class CreateLeadController {
    constructor(private createLeadUseCase: CreateLeadUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void>  {
        try {
            const { nombre, correo, telefono } = req.body;
            await this.createLeadUseCase.execute({ nombre, correo, telefono });
            res.status(201).json({ message: 'Lead creado exitosamente.' });
        }catch (error) {
            next(error);
        }
    }
}
