import { check } from 'express-validator';

export const registerNiñoValidator = [
    check('nombre')
    .notEmpty()
    .withMessage('El nombre del niño es obligatorio'),

    check('fecha_nacimiento')
    .isDate()
    .withMessage('La fecha de nacimiento debe ser válida'),

    check('direccion')
    .notEmpty()
    .withMessage('La dirección es obligatoria'),
];
