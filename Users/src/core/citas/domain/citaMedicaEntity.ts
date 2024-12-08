export class CitaMedica {
    constructor(
        public readonly id_cita: string,
        public readonly id_usuario: string,
        public readonly fecha_cita: Date,
        public readonly observaciones: string,
        public readonly recordatorio: Date
    ) { }
}
