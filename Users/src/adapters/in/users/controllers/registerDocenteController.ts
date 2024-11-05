import { Request, Response, NextFunction } from 'express';
import { RegisterDocenteUseCase } from '../../../../application/users/use-cases/registerDocenteUseCase';
import { RegisterDocenteDTO } from '../dtos/registerDocenteDto';
import { DocenteRepository } from '../../../../adapters/out/database/users/docenteRepository';

export class RegisterDocenteController {
    constructor(
        private registerDocenteUseCase: RegisterDocenteUseCase,
        private docenteRepository: DocenteRepository
    ) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const docenteDTO: RegisterDocenteDTO = req.body;
            const docente = await this.registerDocenteUseCase.execute(docenteDTO);

            // Obtener la información completa del docente con los datos del usuario
            const docenteCompleto = await this.docenteRepository.findById(docente.id_docente);

            res.status(201).json(docenteCompleto);
        } catch (error) {
            next(error);
        }
    }
}
