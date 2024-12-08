import { v4 as uuidv4 } from 'uuid';

export class Docente {
    constructor(
        public id_docente: string = uuidv4(),
        public id_usuario: string,
        public materia: 'Matemáticas' | 'Lingüística' | 'Trazo',
        public direccion: string
    ) {}
}
