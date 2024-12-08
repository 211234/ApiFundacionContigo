import { Request, Response, NextFunction } from 'express';
import { GetPadresConHijosUseCase } from '../../../../application/actividades/use-case/getPadresConHijosUseCase';

export class GetPadresConHijosController {
    constructor(private readonly getPadresConHijosUseCase: GetPadresConHijosUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const padresConHijos = await this.getPadresConHijosUseCase.execute();

            res.status(200).json(padresConHijos);
        } catch (error) {
            next(error);
        }
    }
}
