import { body } from 'express-validator';

export const createCitaMedicaValidator = [
    body('id_usuario')
        .notEmpty()
        .withMessage('El ID de usuario es obligatorio')
        .isString()
        .withMessage('El ID de usuario debe ser una cadena de texto válida'),

    body('fecha_cita')
        .notEmpty()
        .withMessage('La fecha de la cita es obligatoria')
        .isISO8601()
        .withMessage('La fecha debe tener un formato válido (YYYY-MM-DD HH:mm:ss)'),

    body('observaciones')
        .optional()
        .isString()
        .withMessage('Las observaciones deben ser una cadena de texto'),

    body('recordatorio')
        .optional()
        .isISO8601()
        .withMessage('El recordatorio debe tener un formato válido de fecha y hora (YYYY-MM-DD HH:mm:ss)'),
];
