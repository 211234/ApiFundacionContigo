import { body } from 'express-validator';

export const updateAlimentoValidator = [
    body('nombre')
        .optional()
        .isString()
        .withMessage('El nombre debe ser una cadena de texto'),

    body('categoria')
        .optional()
        .isIn(['Desayuno', 'Comida', 'Cena', 'Entrémes'])
        .withMessage('La categoría debe ser uno de los valores permitidos: Desayuno, Comida, Cena, Entrémes'),

    body('horario')
        .optional()
        .isString()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('El horario debe tener el formato HH:mm (24 horas)'),
];
