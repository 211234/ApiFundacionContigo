export interface UpdateAlimentoDTO {
    nombre?: string;
    categoria?: 'Desayuno' | 'Comida' | 'Cena' | 'Entrémes';
    horario?: string;
}
