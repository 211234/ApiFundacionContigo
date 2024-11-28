export class Alimento {
    constructor(
        public readonly id_alimento: string,
        public readonly id_usuario: string,
        public readonly nombre: string,
        public readonly categoria: 'Desayuno' | 'Comida' | 'Cena' | 'Entrémes',
        public readonly horario: string // Formato TIME (HH:MM:SS)
    ) { }
}
