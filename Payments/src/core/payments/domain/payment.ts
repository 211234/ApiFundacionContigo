import { Estado } from "./estado";

export class Payment {
    constructor(
        public id: string,
        public usuarioId: string,
        public total: number,
        public estado: Estado,
        public metadata: object,
        public creadoEn: Date,
        public actualizadoEn: Date
    ) { }
}
