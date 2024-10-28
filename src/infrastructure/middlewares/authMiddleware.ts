import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../core/users/domain/userEntity';
import { env } from '../config/env';

// Configuración de secreto JWT
const secret = env.jwt.secret;
if (!secret) {
    throw new Error('JWT_SECRET is not defined');
}

// Generar token
export const generateToken = (user: User): string => {
    const payload = {
        id_usuario: user.id_usuario,
        tipo: user.tipo,
    };
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Verificar token
export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Tipo extendido de `Request` con `user`
interface AuthRequest extends Request {
    user?: { id_usuario: string; tipo: string };
}

// Middleware de autenticación
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(403).json({ message: 'Token required' });
        return;
    }

    try {
        const decoded = verifyToken(token) as jwt.JwtPayload;
        req.user = decoded as { id_usuario: string; tipo: string };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.tipo !== 'Administrador') {
        res.status(403).json({ message: 'Admin access only' });
        return;
    }
    next();
};

// Middleware combinado para autenticación y verificación de administrador
export const adminOnlyMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    authMiddleware(req, res, () => {
        isAdmin(req, res, next);
    });
};
