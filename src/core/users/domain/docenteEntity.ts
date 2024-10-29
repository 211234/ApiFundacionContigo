export class Docente {
    constructor(
        public id_docente: string,
        public id_usuario: string,
        public materia: 'Matemáticas' | 'Lingüística' | 'Trazo',
        public direccion: string
    ) {}
}
