import { Request, Response, NextFunction } from 'express';
import { MedicamentoService } from '../../../../core/medicamentos/services/medicamentoService';

export class GetAllMedicamentosController {
    constructor(
        private medicamentoService: MedicamentoService
    ) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const medicamentos = await this.medicamentoService.getAllMedicamentos();
            res.status(200).json(medicamentos);
        } catch (error) {
            next(error);
        }
    }
}
