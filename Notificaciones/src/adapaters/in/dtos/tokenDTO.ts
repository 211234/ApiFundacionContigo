export interface CreateTokenDTO {
    id_usuario: string;
    nombre: string;
    correo: string;
    creadoPara: 'confirmacion' | 'recuperacion';
}
