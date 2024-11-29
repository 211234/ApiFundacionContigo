import { param } from 'express-validator';

export const getActividadesValidator = [
    param('id_usuario')
        .optional()
        .isUUID()
        .withMessage('El id_usuario debe ser un UUID válido'),

    param('id_docente')
        .optional()
        .isUUID()
        .withMessage('El id_docente debe ser un UUID válido'),
];
