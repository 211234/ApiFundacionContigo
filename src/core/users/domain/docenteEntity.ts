export class Docente {
    id_docente: string;
    id_usuario: string;
    materia: 'Matemáticas' | 'Lingüística' | 'Trazo';

    constructor(id_docente: string, id_usuario: string, materia: 'Matemáticas' | 'Lingüística' | 'Trazo') {
        this.id_docente = id_docente;
        this.id_usuario = id_usuario;
        this.materia = materia;
    }
}
