export interface RegisterUserDTO {
    nombre: string;
    correo: string;
    contraseña: string;
    telefono: string;
    tipo: 'Administrador' | 'Padre' | 'Docente';
}
