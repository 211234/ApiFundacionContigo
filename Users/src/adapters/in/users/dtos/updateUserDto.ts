export interface UpdateUserDTO {
    nombre?: string;
    correo?: string;
    password?: string;
    telefono?: string;
    estado_verificacion?: 'pendiente' | 'confirmado';
}
