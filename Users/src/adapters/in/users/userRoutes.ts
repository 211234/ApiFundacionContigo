import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthRequest } from '../../../interfaces/authRequest';

import {
    registerUserController,
    deleteUserController,
    readUserController,
    updateUserController,
    loginUserController,
    registerDocenteController,
    updateDocenteController,
    getAllDocentesController,
    deleteDocenteController,
    registerNiñoController,
    updateNiñoController,
    auditController,
    confirmAccountController,
    donationController
} from './userDependencies';

import {
    authMiddleware,
    isAdmin,
    isDocenteMiddleware,
    isPadreMiddleware,
} from '../../../infrastructure/middlewares/authMiddleware';
import { auditUserMiddleware } from '../../../infrastructure/middlewares/auditMiddleware';

import { registerUserValidator } from './validators/registerUserValidator';
import { updateUserValidator } from './validators/updateUserValidator';
import { registerHijoValidator } from './validators/registerHijoValidator';
import { registerDocenteValidator } from './validators/registerDocenteValidator';
import { updateHijoValidator } from './validators/updateHijoValidator';
import { updateDocenteValidator } from './validators/updateDocenteValidator';

import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';

const router = Router();

// Configurar límite de intentos para login
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 3, // Máximo de 3 intentos
    message: 'Has excedido el número máximo de intentos. Intenta de nuevo después de 5 minutos.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rutas de autenticación y registro
router.post(
    '/v1/register',
    registerUserValidator,
    validateResults,
    auditUserMiddleware('REGISTER_USER', (req: AuthRequest) => `Registro de usuario con correo ${req.body.correo}`),
    (req: Request, res: Response, next: NextFunction) => registerUserController.handle(req, res, next)
);

router.post(
    '/v1/confirm-account',
    auditUserMiddleware('CONFIRM_ACCOUNT', (req: AuthRequest) => `Confirmación de cuenta para correo ${req.body.correo}`),
    (req: Request, res: Response, next: NextFunction) => confirmAccountController.handle(req, res, next)
);

router.post(
    '/v1/login',
    loginLimiter,
    auditUserMiddleware('LOGIN', (req: AuthRequest) => `Inicio de sesión para usuario con correo ${req.body.correo}`),
    (req: Request, res: Response, next: NextFunction) => loginUserController.handle(req, res, next)
);

// Rutas para usuarios
router.get(
    '/v1/users/:id_usuario',
    authMiddleware,
    auditUserMiddleware('READ_USER', (req: AuthRequest) => `Consulta de usuario con ID ${req.params.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => readUserController.handle(req, res, next)
);

router.put(
    '/v1/users/:id_usuario',
    authMiddleware,
    updateUserValidator,
    validateResults,
    auditUserMiddleware('UPDATE_USER', (req: AuthRequest) => `Actualización de usuario con ID ${req.params.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => updateUserController.handle(req, res, next)
);

router.delete(
    '/v1/users/:id_usuario',
    authMiddleware,
    isAdmin,
    auditUserMiddleware('DELETE_USER', (req: AuthRequest) => `Eliminación de usuario con ID ${req.params.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => deleteUserController.handle(req, res, next)
);

// Rutas para docentes
router.post(
    '/v1/docentes/register',
    authMiddleware,
    isAdmin,
    registerDocenteValidator,
    validateResults,
    auditUserMiddleware('REGISTER_DOCENTE', (req: AuthRequest) => `Registro de docente por usuario con ID ${req.user?.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => registerDocenteController.handle(req, res, next)
);

router.put(
    '/v1/docentes/:id_docente',
    authMiddleware,
    isDocenteMiddleware,
    updateDocenteValidator,
    validateResults,
    auditUserMiddleware('UPDATE_DOCENTE', (req: AuthRequest) => `Actualización de docente con ID ${req.params.id_docente}`),
    (req: Request, res: Response, next: NextFunction) => updateDocenteController.handle(req, res, next)
);

router.get(
    '/v1/docentes',
    authMiddleware,
    isAdmin,
    (req: Request, res: Response, next: NextFunction) => getAllDocentesController.handle(req, res, next)
);

router.delete(
    '/v1/docentes/:id_docente',
    authMiddleware,
    isAdmin,
    auditUserMiddleware('DELETE_DOCENTE', (req: AuthRequest) => `Eliminación de docente con ID ${req.params.id_docente}`),
    (req: Request, res: Response, next: NextFunction) => deleteDocenteController.handle(req, res, next)
);

// Rutas para hijos
router.post(
    '/v1/hijos/register',
    authMiddleware,
    isPadreMiddleware,
    registerHijoValidator,
    validateResults,
    auditUserMiddleware('REGISTER_HIJO', (req: AuthRequest) => `Registro de hijo por usuario con ID ${req.user?.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => registerNiñoController.handle(req, res, next)
);

router.put(
    '/v1/hijos/:id_hijo',
    authMiddleware,
    isPadreMiddleware,
    updateHijoValidator,
    validateResults,
    auditUserMiddleware('UPDATE_HIJO', (req: AuthRequest) => `Actualización de hijo con ID ${req.params.id_hijo}`),
    (req: Request, res: Response, next: NextFunction) => updateNiñoController.handle(req, res, next)
);

// Rutas para auditoría
router.get(
    '/v1/audit',
    authMiddleware,
    (req, res) => auditController.getAuditLogs(req, res)
);

router.get(
    '/v1/audit/:id',
    authMiddleware,
    (req, res) => auditController.getAuditLogById(req, res)
);

router.post(
    '/v1/donations',
    authMiddleware,
    isPadreMiddleware,
    (req: AuthRequest, res: Response, next: NextFunction) =>
        donationController.createDonation(req, res, next)
);

router.post(
    '/v1/donations/capture/:orderId',
    authMiddleware,
    isPadreMiddleware,
    (req: AuthRequest, res: Response, next: NextFunction) =>
        donationController.captureDonation(req, res, next)
);

export default router;
