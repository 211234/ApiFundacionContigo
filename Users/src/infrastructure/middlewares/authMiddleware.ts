import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../core/users/domain/userEntity';
import { env } from '../config/env';
import { UserAuditUseCase } from '../../application/users/use-cases/userAuditUseCase';
import { UserService } from '../../core/users/services/servicesUser';
import { AuditService } from '../../core/users/services/auditService';
import { UserRepository } from '../../adapters/out/database/users/userRepository';
import { AuditRepository } from '../../adapters/out/database/users/auditRepository';
import { pool } from '../config/database';
import { LeadRepository } from '../../adapters/out/database/lead/leadRepository';

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

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.tipo !== 'Administrador') {
        res.status(403).json({ message: 'Admin access only' });
        return;
    }
    next();
};

export const isPadreMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    authMiddleware(req, res, () => {
        if (!req.user || req.user.tipo !== 'Padre') {
            res.status(403).json({ message: 'Solo acceso para usuarios de tipo Padre' });
            return;
        }
        next();
    });
};


// Middleware combinado para autenticación y verificación de administrador
export const adminOnlyMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    authMiddleware(req, res, () => {
        isAdmin(req, res, next);
    });
};

const userRepository = new UserRepository();

const auditRepository = new AuditRepository(pool, userRepository);
const auditService = new AuditService(auditRepository);

const leadRepository = new LeadRepository(); // Assuming LeadRepository is defined somewhere
const userService = new UserService(userRepository, auditService, leadRepository);

// Instancia de `UserAuditUseCase` reutilizando servicios ya creados
const userAuditUseCase = new UserAuditUseCase(userService, auditService);

// Middleware de auditoría corregido
export const auditUserMiddleware = (accion: string, descripcionCallback: (req: Request) => string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const id_usuario = req.user?.id_usuario;

        if (id_usuario) {
            try {
                await userAuditUseCase.auditUserAction({
                    id_usuario,
                    accion,
                    entidad_afectada: 'usuarios',
                    id_entidad: id_usuario,
                    descripcion: descripcionCallback(req), // Descripción dinámica
                });
            } catch (error) {
                console.error("Error registrando acción de auditoría:", error);
            }
        }

        next();
    };
};

export const auditMedicamentoMiddleware = (accion: string, descripcionCallback: (req: Request) => string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const id_usuario = req.user?.id_usuario;

        if (id_usuario) {
            try {
                await userAuditUseCase.auditUserAction({
                    id_usuario,
                    accion,
                    entidad_afectada: 'medicamentos',
                    id_entidad: req.params.id || req.body.id_medicamento,
                    descripcion: descripcionCallback(req), // Descripción dinámica
                });
            } catch (error) {
                console.error("Error registrando acción de auditoría:", error);
            }
        }

        next();
    };
};

// Middleware de auditoría para citas médicas
export const auditCitasMedicasMiddleware = (accion: string, descripcionCallback: (req: Request) => string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const id_usuario = req.user?.id_usuario;

        if (id_usuario) {
            try {
                await userAuditUseCase.auditUserAction({
                    id_usuario,
                    accion,
                    entidad_afectada: 'citas_medicas',
                    id_entidad: req.params.id || req.body.id_cita,
                    descripcion: descripcionCallback(req), // Descripción dinámica
                });
            } catch (error) {
                console.error("Error registrando acción de auditoría en citas médicas:", error);
            }
        }

        next();
    };
};

// Middleware de auditoría para historial de citas médicas
export const auditHistorialCitasMedicasMiddleware = (accion: string, descripcionCallback: (req: Request) => string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const id_usuario = req.user?.id_usuario;

        if (id_usuario) {
            try {
                await userAuditUseCase.auditUserAction({
                    id_usuario,
                    accion,
                    entidad_afectada: 'historial_citas_medicas',
                    id_entidad: req.params.id || req.body.id_historial,
                    descripcion: descripcionCallback(req), // Descripción dinámica
                });
            } catch (error) {
                console.error("Error registrando acción de auditoría en historial de citas médicas:", error);
            }
        }

        next();
    };
};
