import { Router, Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

import {
    createAlimentoController,
    getAlimentosByUserIdController,
    updateAlimentoController,
    deleteAlimentoController
} from './alimentoDependencies';
import { isPadreMiddleware } from '../../../infrastructure/middlewares/authMiddleware';
import { auditAlimentosMiddleware } from '../../../infrastructure/middlewares/authMiddleware';
import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';
import { createAlimentoValidator } from './validators/createAlimentoValidator';
import { updateAlimentoValidator } from './validators/updateAlimentoValidator';

const router = Router();

// Ruta para crear un alimento
router.post(
    '/v1/alimentos',
    createAlimentoValidator,
    validateResults,
    isPadreMiddleware,
    auditAlimentosMiddleware('CREAR', (req: AuthRequest) => `Creación de alimento por usuario ${req.user?.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => createAlimentoController.handle(req, res, next)
);

// Ruta para obtener todos los alimentos de un usuario
router.get(
    '/v1/alimentos/:id_usuario',
    isPadreMiddleware,
    (req: Request, res: Response, next: NextFunction) => getAlimentosByUserIdController.handle(req, res, next)
);

// Ruta para actualizar un alimento
router.put(
    '/v1/alimentos/:id_alimento',
    updateAlimentoValidator,
    validateResults,
    isPadreMiddleware,
    auditAlimentosMiddleware('ACTUALIZAR', (req: AuthRequest) => `Actualización de alimento con ID ${req.params.id_alimento}`),
    (req: Request, res: Response, next: NextFunction) => updateAlimentoController.handle(req, res, next)
);

// Ruta para eliminar un alimento
router.delete(
    '/v1/alimentos/:id_alimento',
    isPadreMiddleware,
    auditAlimentosMiddleware('BORRAR', (req: AuthRequest) => `Borrado de alimento con ID ${req.params.id_alimento}`),
    (req: Request, res: Response, next: NextFunction) => deleteAlimentoController.handle(req, res, next)
);

export default router;
