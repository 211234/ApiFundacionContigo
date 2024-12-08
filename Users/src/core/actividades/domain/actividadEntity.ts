export class Actividad {
    constructor(
        public id_actividad: string,
        public id_docente: string,
        public nombre: string,
        public instrucciones: string,
        public multimedia_url?: string
    ) {}
}
