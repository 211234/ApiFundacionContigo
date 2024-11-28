import { body } from 'express-validator';

export const updateCitaMedicaValidator = [
    body('fecha_cita')
        .optional()
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
