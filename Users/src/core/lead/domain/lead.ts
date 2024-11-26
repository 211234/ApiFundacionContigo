import { v4 as uuidv4 } from 'uuid';

export class Lead {
    constructor(
        public id_lead: string = uuidv4(),
        public nombre: string,
        public correo: string,
        public telefono: string,
        public estado: 'pendiente' | 'confirmado' | 'rechazado',
        public fecha_creacion: Date = new Date()
    ) {}
}
