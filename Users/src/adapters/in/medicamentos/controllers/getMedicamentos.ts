import { Request, Response, NextFunction } from 'express';
import { MedicamentoService } from '../../../../core/medicamentos/services/medicamentoService';

export class GetMedicamentoController {
    constructor(private medicamentoService: MedicamentoService) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const medicamento = await this.medicamentoService.getMedicamentoById(id);

            if (!medicamento) {
                res.status(404).json({ message: 'Medicamento not found' });
                return;
            }

            res.status(200).json(medicamento);
        } catch (error) {
            next(error);
        }
    }
}
 