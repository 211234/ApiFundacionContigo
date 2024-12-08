import { body } from 'express-validator';

export const medicamentoValidationRules = [
    body('nombre')
        .notEmpty()
        .withMessage('El nombre de la medicina es obligatorio')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    body('tipo')
        .notEmpty()
        .withMessage('El tipo de la medicina es obligatorio'),
    body('dosis')
        .notEmpty()
        .withMessage('La dosis de la medicina es obligatoria'),
    body('frecuencia')
        .notEmpty()
        .withMessage('La frecuencia de la medicina es obligatoria'),
    body('descripcion')
        .notEmpty()
        .withMessage('La descripción de la medicina es obligatoria'),
];
