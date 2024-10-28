import { v4 as uuidv4 } from 'uuid';

export class User {
    constructor(
        public id_usuario: string = uuidv4(),
        public nombre: string,
        public correo: string,
        public contraseña: string,
        public telefono: string,
        public tipo: 'Administrador' | 'Padre' | 'Docente',
        public fecha_registro: Date = new Date()
    ) {}
}
