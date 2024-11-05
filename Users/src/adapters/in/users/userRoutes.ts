import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

import {
    registerUserController,
    deleteUserController,
    readUserController,
    updateUserController,
    loginUserController,
    registerDocenteController,
    registerNiñoController,
    updateNiñoController,
    updateDocenteController,
    auditController
} from './userDependencies';

import {
    authMiddleware,
    isAdmin,
    isPadre,
    padreOnlyMiddleware,
    adminOnlyMiddleware,
    auditMiddleware
} from '../../../infrastructure/middlewares/authMiddleware';


import { registerUserValidator } from './validators/registerUserValidator';
import { updateUserValidator } from './validators/updateUserValidator';
import { registerNiñoValidator } from './validators/registerHijoValidator';
import { registerDocenteValidator } from './validators/registerDocenteValidator';
import { updateNiñoValidator } from './validators/updateHijoValidator';
import { updateDocenteValidator } from '../../../adapters/in/users/validators/updateDocenteValidator';

import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';

const router = Router();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: 'Has excedido el número máximo de intentos. Intenta de nuevo después de 5 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Ruta para el registro de usuarios (auditada)
router.post('/v1/register',
    registerUserValidator,
    validateResults,
    auditMiddleware('REGISTER_USER', (req: AuthRequest) => `Registro de usuario con correo ${req.body.correo}`),
    (req: Request, res: Response, next: NextFunction) =>
        registerUserController.handle(req, res, next)
);

// Ruta de inicio de sesión (auditada)
router.post('/v1/login',
    loginLimiter,
    auditMiddleware('LOGIN', (req: AuthRequest) => `Inicio de sesión para usuario con correo ${req.body.correo}`),
    (req: Request, res: Response, next: NextFunction) =>
        loginUserController.handle(req, res, next)
);

// Ruta para eliminación de usuario (auditada)
router.delete('/v1/users/:id_usuario',
    authMiddleware,
    isAdmin,
    auditMiddleware('DELETE_USER', (req: AuthRequest) => `Usuario con ID ${req.user?.id_usuario} eliminó usuario con ID ${req.params.id_usuario}`),
    (req: AuthRequest, res: Response, next: NextFunction) =>
        deleteUserController.handle(req, res, next)
);

// Ruta para leer usuario
router.get('/v1/users/:id_usuario',
    authMiddleware,
    auditMiddleware('READ_USER', (req: AuthRequest) => `Usuario con ID ${req.user?.id_usuario} leyó información de usuario con ID ${req.params.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) =>
        readUserController.handle(req, res, next)
);

router.put(
    '/v1/users/:id_usuario',
    authMiddleware,
    updateUserValidator,
    validateResults,
    auditMiddleware('UPDATE_USER', (req: AuthRequest) => `El usuario con ID ${req.user?.id_usuario} actualizó el usuario con ID ${req.params.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) =>
        updateUserController.handle(req, res, next)
);

// Rutas para el registro y actualización de docentes y niños
router.post(
    '/v1/docentes/register',
    authMiddleware,
    isAdmin,
    registerDocenteValidator,
    validateResults,
    auditMiddleware('REGISTER_DOCENTE', (req: AuthRequest) => `El usuario con ID ${req.user?.id_usuario} registró un nuevo docente`),
    (req: Request, res: Response, next: NextFunction) =>
        registerDocenteController.handle(req, res, next)
);

router.post(
    '/v1/niños/register',
    authMiddleware,
    isPadre,
    registerNiñoValidator,
    validateResults,
    auditMiddleware('REGISTER_NIÑO', (req: AuthRequest) => `El usuario con ID ${req.user?.id_usuario} registró un nuevo niño`),
    (req: Request, res: Response, next: NextFunction) =>
        registerNiñoController.handle(req, res, next)
);

router.put(
    '/v1/niños/:id_niño',
    authMiddleware,
    padreOnlyMiddleware,
    updateNiñoValidator,
    validateResults,
    auditMiddleware('UPDATE_NIÑO', (req: AuthRequest) => `El usuario con ID ${req.user?.id_usuario} actualizó al niño con ID ${req.params.id_niño}`),
    (req: Request, res: Response, next: NextFunction) =>
        updateNiñoController.handle(req, res, next)
);

router.put(
    '/v1/docentes/:id_docente',
    authMiddleware,
    adminOnlyMiddleware,
    updateDocenteValidator,
    validateResults,
    auditMiddleware('UPDATE_DOCENTE', (req: AuthRequest) => `El usuario con ID ${req.user?.id_usuario} actualizó al docente con ID ${req.params.id_docente}`),
    (req: Request, res: Response, next: NextFunction) =>
        updateDocenteController.handle(req, res, next)
);

// Ruta para obtener todos los registros de auditoría
router.get('/v1/audit', authMiddleware, (req: Request, res: Response, next: NextFunction) =>
    auditController.getAuditLogs(req, res)
);

// Ruta para obtener un registro de auditoría por ID
router.get('/v1/audit/:id', authMiddleware, (req: Request, res: Response, next: NextFunction) =>
    auditController.getAuditLogById(req, res)
);

export default router;
