export interface RegisterDocenteDTO {
    id_usuario: string;
    nombre: string;
    correo: string;
    password: string;
    telefono: string;
    materia: 'Matemáticas' | 'Lingüística' | 'Trazo';
    direccion: string;
}
