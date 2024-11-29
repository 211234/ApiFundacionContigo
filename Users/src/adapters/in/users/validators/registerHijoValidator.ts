import { body } from 'express-validator';

export const registerHijoValidator = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre del niño es obligatorio'),

    body('fecha_nacimiento')
        .isDate()
        .withMessage('La fecha de nacimiento debe ser válida'),

    body('direccion')
        .notEmpty()
        .withMessage('La dirección es obligatoria'),
];
