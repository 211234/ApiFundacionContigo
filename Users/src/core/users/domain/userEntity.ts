import { v4 as uuidv4 } from 'uuid';

export class User {
    constructor(
        public id_usuario: string = uuidv4(),
        public nombre: string,
        public correo: string,
        public password: string,
        public telefono: string,
        public tipo: 'Administrador' | 'Padre' | 'Docente',
        public estado_verificacion: 'pendiente' | 'confirmado' = 'pendiente',
        public fecha_registro: Date = new Date()
    ) {}
}
