export interface CreatePaymentDTO {
    usuarioId: string;
    total: number;
    metadata?: object;
}
