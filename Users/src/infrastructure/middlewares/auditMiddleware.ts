import { Request, NextFunction, Response } from 'express';
import { UserAuditUseCase } from '../../application/users/use-cases/userAuditUseCase';
import { AuditService } from '../../core/users/services/auditService';
import { UserService } from '../../core/users/services/servicesUser';
import { UserRepository } from '../../adapters/out/database/users/userRepository';
import { AuditRepository } from '../../adapters/out/database/users/auditRepository';
import { pool } from '../config/database';
import { AuthRequest } from '../../interfaces/authRequest';

// Repositorios y servicios
const userRepository = new UserRepository();
const auditRepository = new AuditRepository(pool, userRepository);
const auditService = new AuditService(auditRepository);
const userService = new UserService(userRepository, auditService);
const userAuditUseCase = new UserAuditUseCase(userService, auditService);



// Middleware genérico de auditoría
export const auditMiddleware = (
    entidad: string,
    accion: string,
    descripcionCallback: (req: AuthRequest) => string
) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const id_usuario = req.user?.id_usuario;

        if (id_usuario) {
            try {
                await userAuditUseCase.auditUserAction({
                    id_usuario,
                    accion,
                    entidad_afectada: entidad,
                    id_entidad: req.params.id || req.body.id_entidad,
                    descripcion: descripcionCallback(req),
                });
            } catch (error) {
                console.error(`Error registrando acción de auditoría en ${entidad}:`, error);
            }
        }

        next();
    };
};

// Alias para auditorías específicas
export const auditUserMiddleware = (accion: string, descripcionCallback: (req: Request) => string) =>
    auditMiddleware('usuarios', accion, descripcionCallback);

export const auditMedicamentoMiddleware = (accion: string, descripcionCallback: (req: Request) => string) =>
    auditMiddleware('medicamentos', accion, descripcionCallback);

export const auditCitasMedicasMiddleware = (accion: string, descripcionCallback: (req: Request) => string) =>
    auditMiddleware('citas_medicas', accion, descripcionCallback);

export const auditAlimentosMiddleware = (accion: string, descripcionCallback: (req: Request) => string) =>
    auditMiddleware('alimentos', accion, descripcionCallback);

export const auditActividadesMiddleware = (accion: string, descripcionCallback: (req: Request) => string) =>
    auditMiddleware('actividades', accion, descripcionCallback);
