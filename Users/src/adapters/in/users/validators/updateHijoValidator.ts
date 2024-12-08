import { body } from 'express-validator';

export const updateHijoValidator = [
    body('nombre')
        .optional()
        .isString()
        .withMessage('El nombre debe ser un texto válido'),
    body('edad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La edad debe ser un número entero positivo'),
    body('direccion')
        .optional()
        .isString()
        .withMessage('La dirección debe ser un texto válido')
];
