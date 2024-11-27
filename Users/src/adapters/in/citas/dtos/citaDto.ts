export interface CreateCitaDTO {
    id_cita: string;
    id_usuario: string;
    fecha_cita: Date;
    observaciones: string;
    recordatorio: Date;
}
