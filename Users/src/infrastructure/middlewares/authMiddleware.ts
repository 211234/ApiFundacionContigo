import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AuthRequest } from '../../interfaces/authRequest';

// Configuración de secreto JWT
const secret = env.jwt.secret;
if (!secret) {
    throw new Error('JWT_SECRET is not defined');
}

// Generar token
export const generateToken = (payload: object): string => {
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


// Middleware de autenticación
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(403).json({ message: 'Authorization token is missing' });
        return;
    }

    try {
        const decoded = verifyToken(token) as jwt.JwtPayload;
        req.user = decoded as { id_usuario: string; tipo: string };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// Middleware para verificar roles
export const isRoleMiddleware = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        authMiddleware(req, res, () => {
            if (!req.user || req.user.tipo !== role) {
                res.status(403).json({ message: `Access restricted to ${role} users only` });
                return;
            }
            next();
        });
    };
};

// Alias para roles específicos
export const isAdmin = isRoleMiddleware('Administrador');
export const isPadreMiddleware = isRoleMiddleware('Padre');
export const isDocenteMiddleware = isRoleMiddleware('Docente');
