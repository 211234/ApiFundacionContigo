import { body } from 'express-validator';

export const registerDocenteValidator = [
    body('nombre')
        .notEmpty()
        .isString()
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('El nombre debe ser un texto válido, solo debe contener letras y no debe incluir números o caracteres especiales'),

    body('correo')
        .notEmpty()
        .isEmail()
        .withMessage('Debe proporcionar un correo electrónico válido'),

    body('password')
        .notEmpty()
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial'),

    body('telefono')
        .optional()
        .isNumeric()
        .withMessage('El teléfono debe contener solo números')
        .isLength({ min: 10, max: 15 })
        .withMessage('El teléfono debe tener entre 10 y 15 dígitos'),

    body('materia')
        .notEmpty()
        .withMessage('La materia es obligatoria')
        .isIn(['Matemáticas', 'Lingüística', 'Trazo'])
        .withMessage('La materia debe ser válida (Matemáticas, Lingüística o Trazo)'),

    body('direccion')
        .optional()
        .isString()
        .withMessage('La dirección debe ser un texto válido'),
];
