import { body } from 'express-validator';

export const createActividadValidator = [
    body('id_docente')
        .isUUID()
        .withMessage('El id_docente debe ser un UUID válido'),

    body('nombre')
        .isString()
        .notEmpty()
        .withMessage('El nombre es obligatorio y debe ser un texto'),

    body('instrucciones')
        .isString()
        .notEmpty()
        .withMessage('Las instrucciones son obligatorias y deben ser texto'),

    body('multimedia_url')
        .optional()
        .isURL()
        .withMessage('El multimedia_url debe ser una URL válida'),
];
