import { Router, Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../interfaces/authRequest';

import {
    createAlimentoController,
    getAlimentosByUserIdController,
    updateAlimentoController,
    deleteAlimentoController
} from './alimentoDependencies';

import { isPadreMiddleware } from '../../../infrastructure/middlewares/authMiddleware';
import { auditAlimentosMiddleware } from '../../../infrastructure/middlewares/auditMiddleware';
import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';
import { createAlimentoValidator } from './validators/createAlimentoValidator';
import { updateAlimentoValidator } from './validators/updateAlimentoValidator';

const router = Router();

// Crear un alimento
router.post(
    '/v1/alimentos',
    isPadreMiddleware,
    createAlimentoValidator,   
    validateResults,           
    auditAlimentosMiddleware('CREAR', (req: AuthRequest) => `Creación de alimento por usuario ${req.user?.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => createAlimentoController.handle(req, res, next)
);

router.get(
    '/v1/alimentos/:id_usuario',
    isPadreMiddleware,
    (req: Request, res: Response, next: NextFunction) => getAlimentosByUserIdController.handle(req, res, next)
);

router.put(
    '/v1/alimentos/:id_alimento',
    isPadreMiddleware,
    updateAlimentoValidator,   
    validateResults,          
    auditAlimentosMiddleware('ACTUALIZAR', (req: AuthRequest) => `Actualización de alimento con ID ${req.params.id_alimento}`),
    (req: Request, res: Response, next: NextFunction) => updateAlimentoController.handle(req, res, next)
);

router.delete(
    '/v1/alimentos/:id_alimento',
    isPadreMiddleware,
    auditAlimentosMiddleware('BORRAR', (req: AuthRequest) => `Borrado de alimento con ID ${req.params.id_alimento}`),
    (req: Request, res: Response, next: NextFunction) => deleteAlimentoController.handle(req, res, next)
);

export default router;
