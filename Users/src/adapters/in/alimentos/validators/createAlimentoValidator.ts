import { body } from 'express-validator';

export const createAlimentoValidator = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre del alimento es obligatorio')
        .isString()
        .withMessage('El nombre debe ser una cadena de texto'),

    body('categoria')
        .notEmpty()
        .withMessage('La categoría del alimento es obligatoria')
        .isIn(['Desayuno', 'Comida', 'Cena', 'Entrémes'])
        .withMessage('La categoría debe ser uno de los valores permitidos: Desayuno, Comida, Cena, Entrémes'),

    body('horario')
        .notEmpty()
        .withMessage('El horario es obligatorio')
        .isString()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('El horario debe tener el formato HH:mm (24 horas)'),
];
