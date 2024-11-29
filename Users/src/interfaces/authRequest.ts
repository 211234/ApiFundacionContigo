import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id_usuario: string;
        tipo: string;
    };
}
