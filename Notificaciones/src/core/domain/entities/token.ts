import { Schema, model, Document } from 'mongoose';

export interface IToken extends Document {
    id_usuario: string;
    nombre: string;
    correo: string;
    creadoPara: 'confirmacion' | 'recuperacion';
    fecha_creacion: Date;
    usado: boolean;
    expirado: boolean;
    codigo: string; // Nuevo campo para el código de 4 dígitos
    expiresAt: Date;
}

const tokenSchema = new Schema<IToken>({
    id_usuario: { type: String, required: true },
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    creadoPara: { type: String, enum: ['confirmacion', 'recuperacion'], required: true },
    fecha_creacion: { type: Date, default: Date.now },
    usado: { type: Boolean, default: false },
    expirado: { type: Boolean, default: false },
    codigo: { type: String, required: true, unique: true  }, // Nuevo campo
    expiresAt: { type: Date, required: true },
});

// Índice TTL para expiración automática
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenModel = model<IToken>('Token', tokenSchema);
