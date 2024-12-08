export class Transaccion {
    id: string;
    id_usuario: string;
    total: number;
    paypal_order_id: string;
    estado: string; 
    metadata?: object; 
    created_at: Date; 
    updated_at: Date; 

    constructor(data: {
        id: string;
        id_usuario: string;
        total: number;
        paypal_order_id: string;
        estado: string;
        metadata?: object;
        created_at?: Date;
        updated_at?: Date;
    }) {
        this.id = data.id;
        this.id_usuario = data.id_usuario;
        this.total = data.total;
        this.paypal_order_id = data.paypal_order_id;
        this.estado = data.estado;
        this.metadata = data.metadata;
        this.created_at = data.created_at || new Date();
        this.updated_at = data.updated_at || new Date();
    }
}
