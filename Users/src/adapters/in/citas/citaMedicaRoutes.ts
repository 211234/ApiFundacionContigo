import { Router, Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

import {
    createCitaMedicaController,
    getCitasByUserIdController,
    updateCitaMedicaController,
    deleteCitaMedicaController,
} from '../citas/citaDependencies';
import { isPadreMiddleware } from '../../../infrastructure/middlewares/authMiddleware';
import { auditCitasMedicasMiddleware } from '../../../infrastructure/middlewares/authMiddleware';

const router = Router();

router.post(
    '/v1/citas-medicas',
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
    isPadreMiddleware,
    auditCitasMedicasMiddleware('ACTUALIZAR', (req: AuthRequest) => `Actualización de cita médica con ID ${req.params.id_cita}`),
    (req: Request, res: Response, next: NextFunction) => updateCitaMedicaController.handle(req, res, next)
);

router.delete(
    '/v1/citas-medicas/:id_cita',
    isPadreMiddleware,
    auditCitasMedicasMiddleware('BORRAR', (req: AuthRequest) => `Borrado de cita médica con ID ${req.params.id_cita}`),
    (req: Request, res: Response, next: NextFunction) => deleteCitaMedicaController.handle(req, res, next)
);

export default router;
