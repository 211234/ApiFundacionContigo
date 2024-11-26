import { Router, Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

import {
    createMedicamentoController,
    getMedicamentoController,
    updateMedicamentoController,
    deleteMedicamentoController,
    getAllMedicamentosController
} from './medicamentoDependencies';

import {
    authMiddleware,
    isPadreMiddleware,
    auditMedicamentoMiddleware
} from '../../../infrastructure/middlewares/authMiddleware';

import { medicamentoValidationRules } from './validators/registerMedicamentoValidator';
import { medicamentoValidationRulesUpdate } from './validators/updateMedicamentoValidator';
import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';

const router = Router();

router.post(
    '/v1/medicamentos',
    authMiddleware, // Primero verifica autenticación
    isPadreMiddleware, // Después verifica si es un Padre
    medicamentoValidationRules, // Valida la entrada
    validateResults, // Procesa resultados de validación
    auditMedicamentoMiddleware('CREAR', (req: AuthRequest) => `El usuario ${req.user?.id_usuario} registró el medicamento ${req.body.nombre}`),
    (req: Request, res: Response, next: NextFunction) => createMedicamentoController.handle(req, res, next)
);

router.get(
    '/v1/medicamentos/:id',
    authMiddleware,
    isPadreMiddleware,
    (req: Request, res: Response, next: NextFunction) => getMedicamentoController.handle(req, res, next)
);

router.get(
    '/v1/medicamentos',
    authMiddleware,
    isPadreMiddleware,
    (req: Request, res: Response, next: NextFunction) => getAllMedicamentosController.handle(req, res, next)
);

router.put(
    '/v1/medicamentos/:id',
    authMiddleware,
    isPadreMiddleware,
    medicamentoValidationRulesUpdate,
    validateResults,
    auditMedicamentoMiddleware('ACTUALIZAR', (req: AuthRequest) => `El usuario ${req.user?.id_usuario} actualizó el medicamento con ID ${req.params.id}`),
    (req: Request, res: Response, next: NextFunction) => updateMedicamentoController.handle(req, res, next)
);

router.delete(
    '/v1/medicamentos/:id',
    authMiddleware,
    isPadreMiddleware,
    auditMedicamentoMiddleware('BORRAR', (req: AuthRequest) => `El usuario ${req.user?.id_usuario} eliminó el medicamento con ID ${req.params.id}`),
    (req: Request, res: Response, next: NextFunction) => deleteMedicamentoController.handle(req, res, next)
);

export default router;
