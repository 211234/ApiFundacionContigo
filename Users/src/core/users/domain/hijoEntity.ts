import { v4 as uuidv4 } from 'uuid';

export class Hijo {
    constructor(
        public id_hijo: string = uuidv4(),
        public id_usuario: string,
        public nombre: string,
        public fecha_nacimiento: Date,
        public direccion: string
    ) { }
}
