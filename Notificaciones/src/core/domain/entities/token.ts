import { Schema, model, Document } from 'mongoose';

export interface IToken extends Document {
    id_usuario: string;
    nombre: string;
    correo: string;
    creadoPara: 'confirmacion' | 'recuperacion';
    fecha_creacion: Date;
    usado: boolean;
    expirado: boolean;
}

const tokenSchema = new Schema<IToken>({
    id_usuario: { type: String, required: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    creadoPara: { type: String, enum: ['confirmacion', 'recuperacion'], required: true },
    fecha_creacion: { type: Date, default: Date.now },
    usado: { type: Boolean, default: false },
    expirado: { type: Boolean, default: false }
});

export const TokenModel = model<IToken>('Token', tokenSchema);
