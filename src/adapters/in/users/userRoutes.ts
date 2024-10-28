import { Router, Request, Response, NextFunction } from 'express';
import {
    registerUserController,
    deleteUserController,
    readUserController,
    updateUserController,
    loginUserController
} from './userDependencies';
import { authMiddleware, isAdmin } from '../../../infrastructure/middlewares/authMiddleware';
import { registerUserValidator } from './validators/registerUserValidator';
import { updateUserValidator } from './validators/updateUserValidator';
import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';

const router = Router();

// Ruta para registrar un usuario (ej. Padre). No requiere ser administrador.
router.post('/v1/register', registerUserValidator, validateResults, (req: Request, res: Response, next: NextFunction) => 
    registerUserController.handle(req, res, next)
);

// Ruta para iniciar sesión
router.post('/v1/login', (req: Request, res: Response, next: NextFunction) => 
    loginUserController.handle(req, res, next)
);

// Rutas protegidas: requieren autenticación y algunas también requieren permisos de administrador.
router.delete('/v1/users/:id_usuario', authMiddleware, isAdmin, (req: Request, res: Response, next: NextFunction) => 
    deleteUserController.handle(req, res, next)
);

router.get('/v1/users/:id_usuario', authMiddleware, (req: Request, res: Response, next: NextFunction) => 
    readUserController.handle(req, res, next)
);

router.put('/v1/users/:id_usuario', authMiddleware, updateUserValidator, validateResults, (req: Request, res: Response, next: NextFunction) => 
    updateUserController.handle(req, res, next)
);

export default router;
