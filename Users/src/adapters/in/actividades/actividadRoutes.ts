import { Router, Request, Response, NextFunction } from 'express';
import { isDocenteMiddleware, isPadreMiddleware } from '../../../infrastructure/middlewares/authMiddleware';
import { uploadImage } from '../../../adapters/out/services/cloudnary';
import upload from '../../../infrastructure/middlewares/multer';

import {
    getActividadesByUsuarioController,
    getActividadesByDocenteController,
    getPadresConHijosController,
    updateEstadoActividadController,
    assignActividadController,
    createActividadController
} from './actividadDependencies';

import { createActividadValidator } from './validators/createActividadValidator';
import { assignActividadValidator } from './validators/assignActividadValidator';
import { getActividadesValidator } from './validators/getActividadesValidator';

import { validateResults } from '../../../infrastructure/middlewares/validationMiddleware';

const router = Router();

// Obtener actividades asignadas a un usuario
router.get(
    '/v1/actividades/usuario/:id_usuario',
    getActividadesValidator,
    validateResults,
    (req: Request, res: Response, next: NextFunction) => getActividadesByUsuarioController.handle(req, res, next)
);

// Obtener actividades creadas por un docente
router.get(
    '/v1/actividades/docente/:id_docente',
    isDocenteMiddleware,
    getActividadesValidator,
    validateResults,
    (req: Request, res: Response, next: NextFunction) => getActividadesByDocenteController.handle(req, res, next)
);

// Obtener padres y sus hijos
router.get(
    '/v1/actividades/padreshijos',
    isDocenteMiddleware,
    (req: Request, res: Response, next: NextFunction) => getPadresConHijosController.handle(req, res, next)
);

// Asignar actividades a usuarios
router.post(
    '/v1/actividades/asignar',
    isDocenteMiddleware,
    assignActividadValidator,
    validateResults,
    (req: Request, res: Response, next: NextFunction) => assignActividadController.handle(req, res, next)
);

// Crear nueva actividad
router.post(
    '/v1/actividades',
    isDocenteMiddleware,
    upload.single('image'),
    createActividadValidator,
    validateResults,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Verificar si se envió un archivo
            const multimediaUrl = req.file
                ? await uploadImage(req.file.path) // Si hay archivo, subir y obtener URL
                : req.body.multimedia_url || null; // Si no hay archivo, usar URL del body

            req.body.multimedia_url = multimediaUrl;

            createActividadController.handle(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);


// Actualizar estado de actividad (evidencia, tiempo, fecha de completado)
router.put(
    '/v1/estado-actividades/:id_estado',
    upload.single('evidencia_url'), // Procesar el archivo con Multer
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Verificar si se cargó un archivo
            if (!req.file) {
                res.status(400).send('No se cargó ningún archivo.');
                return;
            }
            // Subir la imagen a Cloudinary
            const evidenciaUrl = await uploadImage(req.file.path);
            console.log('URL generada para evidencia:', evidenciaUrl);
            // Agregar la URL al cuerpo de la solicitud
            req.body.evidencia_url = evidenciaUrl;
            // Validar y enviar los datos al controlador
            const { fecha_completado, tiempo_minutos } = req.body;
            // Validación adicional (evitar datos faltantes)
            if (!fecha_completado || !tiempo_minutos) {
                res.status(400).send('Faltan datos obligatorios: fecha_completado o tiempo_minutos.');
                return;
            }
            console.log('Datos enviados al controlador:', {
                id_estado: req.params.id_estado,
                evidenciaUrl,
                fecha_completado,
                tiempo_minutos,
            });
            updateEstadoActividadController.handle(req, res, next);
        } catch (error) {
            console.error('Error al procesar actualización:', error);
            next(error);
        }
    }
);

export default router;
