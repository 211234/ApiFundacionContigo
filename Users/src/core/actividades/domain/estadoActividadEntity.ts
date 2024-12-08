export class EstadoActividad {
    constructor(
        public id_estado: string,
        public id_actividad: string,
        public id_usuario: string,
        public evidencia_url: string,
        public fecha_completado: Date,
        public tiempo_minutos: number,
        public estado: boolean = false
    ) {}
}
