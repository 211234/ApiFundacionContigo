import { Router, Request, Response, NextFunction } from 'express';
import {
    registerUserController,
    deleteUserController,
    readUserController,
    updateUserController,
    loginUserController,
    registerDocenteController,
    registerNiñoController
} from './userDependencies';
import { authMiddleware, isAdmin, isPadre } from '../../../infrastructure/middlewares/authMiddleware';
import { registerUserValidator } from './validators/registerUserValidator';
import { updateUserValidator } from './validators/updateUserValidator';
import { registerNiñoValidator } from './validators/registerNiñoValidator';
import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';
import { registerDocenteValidator } from './validators/registerDocenteValidator';

const router = Router();

router.post('/v1/register', registerUserValidator, validateResults, (req: Request, res: Response, next: NextFunction) =>
    registerUserController.handle(req, res, next)
);

router.post('/v1/login', (req: Request, res: Response, next: NextFunction) =>
    loginUserController.handle(req, res, next)
);

// Solo el administrador puede eliminar usuarios
router.delete('/v1/users/:id_usuario', authMiddleware, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    deleteUserController.handle(req, res, next)
);

router.get('/v1/users/:id_usuario', authMiddleware, (req: Request, res: Response, next: NextFunction) =>
    readUserController.handle(req, res, next)
);

router.put('/v1/users/:id_usuario', authMiddleware, updateUserValidator, validateResults, (req: Request, res: Response, next: NextFunction) =>
    updateUserController.handle(req, res, next)
);

// Ruta para registrar un docente, accesible solo por usuarios de tipo Administrador
router.post('/v1/docentes/register', authMiddleware, isAdmin, registerDocenteValidator, validateResults, (req: Request, res: Response, next: NextFunction) =>
    registerDocenteController.handle(req, res, next)
);

// Ruta para registrar un niño, accesible solo por usuarios de tipo Padre
router.post('/v1/niños/register', authMiddleware, isPadre, registerNiñoValidator, validateResults, (req: Request, res: Response, next: NextFunction) =>
    registerNiñoController.handle(req, res, next)
);

export default router;
