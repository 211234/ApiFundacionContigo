import { Router, Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../../interfaces/authRequest';


import {
    createCitaMedicaController,
    getCitasByUserIdController,
    updateCitaMedicaController,
    deleteCitaMedicaController,
} from '../citas/citaDependencies';
import { authMiddleware, isPadreMiddleware } from '../../../infrastructure/middlewares/authMiddleware';
import { auditCitasMedicasMiddleware } from '../../../infrastructure/middlewares/auditMiddleware';
import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';
import { createCitaMedicaValidator } from './validators/createCitaMedicaValidator';
import { updateCitaMedicaValidator } from './validators/updateCitaMedicaValidator';

const router = Router();

router.post(
    '/v1/citas-medicas',
    createCitaMedicaValidator,
    validateResults,
    authMiddleware,
    isPadreMiddleware,
    auditCitasMedicasMiddleware('CREAR', (req: AuthRequest) => `Creación de cita médica por usuario ${req.user?.id_usuario}`),
    (req: Request, res: Response, next: NextFunction) => createCitaMedicaController.handle(req, res, next)
);

router.get(
    '/v1/citas-medicas/:id_usuario',
    (req: Request, res: Response, next: NextFunction) => {
        getCitasByUserIdController.handle(req, res, next);
    }
);

router.put(
    '/v1/citas-medicas/:id_cita',
    updateCitaMedicaValidator,
    validateResults,
    authMiddleware,
    isPadreMiddleware,
    auditCitasMedicasMiddleware('ACTUALIZAR', (req: AuthRequest) => `Actualización de cita médica con ID ${req.params.id_cita}`),
    (req: Request, res: Response, next: NextFunction) => updateCitaMedicaController.handle(req, res, next)
);

router.delete(
    '/v1/citas-medicas/:id_cita',
    authMiddleware,
    isPadreMiddleware,
    auditCitasMedicasMiddleware('BORRAR', (req: AuthRequest) => `Borrado de cita médica con ID ${req.params.id_cita}`),
    (req: Request, res: Response, next: NextFunction) => deleteCitaMedicaController.handle(req, res, next)
);

export default router;
