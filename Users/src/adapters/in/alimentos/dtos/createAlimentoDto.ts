export interface AlimentoDTO {
    id_usuario: string;
    nombre: string;
    categoria: 'Desayuno' | 'Comida' | 'Cena' | 'Entrémes';
    horario: string;
}
