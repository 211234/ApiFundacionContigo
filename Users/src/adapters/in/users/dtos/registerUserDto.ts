export interface RegisterUserDTO {
    nombre: string;
    correo: string;
    password: string;
    telefono: string;
    tipo: 'Administrador' | 'Padre' | 'Docente';
    estado_verificacion?: 'pendiente' | 'confirmado';
}
