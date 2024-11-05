import { RegisterUserUseCase } from '../../../application/users/use-cases/registerUserUseCase';
import { DeleteUserUseCase } from '../../../application/users/use-cases/deleteUserUseCase';
import { ReadUserUseCase } from '../../../application/users/use-cases/findUserByIdUseCase';
import { UpdateUserUseCase } from '../../../application/users/use-cases/updateUserUseCase';
import { RegisterUserController } from './controllers/registerUserController';
import { DeleteUserController } from './controllers/deleteUserController';
import { ReadUserController } from './controllers/readUserController';
import { UpdateUserController } from './controllers/updateUserController';
import { UserRepository } from '../../out/database/users/userRepository';
import { UserService } from '../../../core/users/services/servicesUser';
import { LoginUserUseCase } from '../../../application/users/use-cases/loginUserUseCase';
import { LoginUserController } from './controllers/loginUserController';
import { RegisterDocenteUseCase } from '../../../application/users/use-cases/registerDocenteUseCase';
import { RegisterDocenteController } from './controllers/registerDocenteController';
import { DocenteRepository } from '../../out/database/users/docenteRepository';
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


// Crear instancias de repositorios
const userRepository = new UserRepository();
const docenteRepository = new DocenteRepository();
const hijoRepository = new HijoRepository();

// Crear instancias de servicios
const userService = new UserService(userRepository);

// Crear instancias de casos de uso
const registerUserUseCase = new RegisterUserUseCase(userRepository, userService);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const readUserUseCase = new ReadUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, userService);

const registerDocenteUseCase = new RegisterDocenteUseCase(userRepository, docenteRepository);
const registerHijoUseCase = new RegisterHijoUseCase(userRepository, hijoRepository);
const updateHijoUseCase = new UpdateHijoUseCase(hijoRepository);
const updateDocenteUseCase = new UpdateDocenteUseCase(docenteRepository);

// Instancia del repositorio de auditoría
const auditRepository = new AuditRepository();
// Crear instancia de servicio de auditoría
const auditService = new AuditService(auditRepository);

// Caso de uso de auditoría
const userAuditUseCase = new UserAuditUseCase(userService, auditService);

// Controlador de auditoría
export const auditController = new AuditController(auditService);

// Crear instancias de controladores
export const registerUserController = new RegisterUserController(registerUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const readUserController = new ReadUserController(readUserUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase, userAuditUseCase);

export const registerDocenteController = new RegisterDocenteController(registerDocenteUseCase, docenteRepository);
export const registerNiñoController = new RegisterHijoController(registerHijoUseCase);
export const updateNiñoController = new UpdateHijoController(updateHijoUseCase);
export const updateDocenteController = new UpdateDocenteController(updateDocenteUseCase);
