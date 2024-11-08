import { v4 as uuidv4 } from 'uuid';

export class Medicamento {
    constructor(
        public id_medicamento: string = uuidv4(),
        public id_usuario: string,
        public nombre: string,
        public tipo: string,
        public dosis: string,
        public frecuencia: string,
        public descripcion: string
    ) { }
}
