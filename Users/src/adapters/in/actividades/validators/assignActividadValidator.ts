import { body } from 'express-validator';

export const assignActividadValidator = [
    body('id_actividad')
        .isUUID()
        .withMessage('El id_actividad debe ser un UUID válido'),

    body('usuarios')
        .isArray({ min: 1 })
        .withMessage('El campo usuarios debe ser un arreglo no vacío')
        .custom((usuarios: any[]) => {
            if (!usuarios.every((id) => typeof id === 'string')) {
                throw new Error('Todos los elementos en usuarios deben ser strings');
            }
            return true;
        }),
];
