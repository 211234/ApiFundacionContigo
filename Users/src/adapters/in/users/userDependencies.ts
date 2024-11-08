import { RegisterUserUseCase } from '../../../application/users/use-cases/registerUserUseCase';
import { DeleteUserUseCase } from '../../../application/users/use-cases/deleteUserUseCase';
import { ReadUserUseCase } from '../../../application/users/use-cases/findUserByIdUseCase';
import { UpdateUserUseCase } from '../../../application/users/use-cases/updateUserUseCase';
import { RegisterUserController } from './controllers/registerUserController';
import { DeleteUserController } from './controllers/deleteUserController';
import { ReadUserController } from './controllers/readUserController';
import { UpdateUserController } from './controllers/updateUserController';
import { LoginUserUseCase } from '../../../application/users/use-cases/loginUserUseCase';
import { LoginUserController } from './controllers/loginUserController';
import { RegisterDocenteUseCase } from '../../../application/users/use-cases/registerDocenteUseCase';
import { RegisterDocenteController } from './controllers/registerDocenteController';
import { UpdateDocenteController } from './controllers/updateDocenteController';
import { HijoRepository } from '../../out/database/users/hijoRepository';
import { RegisterHijoUseCase } from '../../../application/users/use-cases/registerHijoUseCase';
import { UpdateHijoUseCase } from '../../../application/users/use-cases/updateHijoUseCase';
import { UpdateDocenteUseCase } from '../../../application/users/use-cases/updateDocenteUseCase';
import { RegisterHijoController } from './controllers/registerHijoController';
import { UpdateHijoController } from './controllers/updateHijoController';
import { AuditRepository } from '../../out/database/users/auditRepository';
import { UserAuditUseCase } from '../../../application/users/use-cases/userAuditUseCase';
import { AuditController } from './controllers/auditController';
import { AuditService } from '../../../core/users/services/auditService';
import { UserRepository } from '../../out/database/users/userRepository';
import { DocenteRepository } from '../../out/database/users/docenteRepository';
import { UserService } from '../../../core/users/services/servicesUser';

// Crear instancias de repositorios
const auditRepository = new AuditRepository();
const auditService = new AuditService(auditRepository);

const userRepository = new UserRepository(auditService); // Aseguramos que se pase el auditService
const docenteRepository = new DocenteRepository();
const hijoRepository = new HijoRepository();

// Crear instancias de servicios
const userService = new UserService(userRepository, auditService);

// Crear instancias de casos de uso
const registerUserUseCase = new RegisterUserUseCase(userRepository, userService);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const readUserUseCase = new ReadUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository, auditService);
const loginUserUseCase = new LoginUserUseCase(userRepository, userService);

const registerDocenteUseCase = new RegisterDocenteUseCase(userRepository, docenteRepository, auditService);
const registerHijoUseCase = new RegisterHijoUseCase(userRepository, hijoRepository, auditService);
const updateHijoUseCase = new UpdateHijoUseCase(hijoRepository);
const updateDocenteUseCase = new UpdateDocenteUseCase(docenteRepository);

// Crear instancias de casos de uso
const userAuditUseCase = new UserAuditUseCase(userService, auditService);

// Crear instancias de controladores
export const registerUserController = new RegisterUserController(registerUserUseCase, auditService);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const readUserController = new ReadUserController(readUserUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase, userAuditUseCase);

export const registerDocenteController = new RegisterDocenteController(registerDocenteUseCase, docenteRepository);
export const registerNiñoController = new RegisterHijoController(registerHijoUseCase);
export const updateNiñoController = new UpdateHijoController(updateHijoUseCase);
export const updateDocenteController = new UpdateDocenteController(updateDocenteUseCase);

// Instancia de controlador de auditoría
export const auditController = new AuditController(auditService);
