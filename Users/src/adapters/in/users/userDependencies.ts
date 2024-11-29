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
import { RabbitMQPublisher } from '../../out/queue/rabbitMQPublisher';
import { TokenService } from '../../../core/users/services/tokenService';
import { ConfirmAccountController } from './controllers/confirmAccountController';
import { pool } from '../../../infrastructure/config/database';
import { LeadRepository } from '../../out/database/lead/leadRepository';
import { GetAllDocentesUseCase } from '../../../application/users/use-cases/getAllDocentesUseCase';
import { DeleteDocenteUseCase } from '../../../application/users/use-cases/deleteDocenteUseCase';
import { GetAllDocentesController } from './controllers/getAllDocentesController';
import { DeleteDocenteController } from './controllers/deleteDocenteController';

// Crear instancias de repositorios
const userRepository = new UserRepository();
const auditRepository = new AuditRepository(pool, userRepository);
const auditService = new AuditService(auditRepository);

// Asignar auditService al userRepository después de su creación
userRepository.setAuditService(auditService);

const docenteRepository = new DocenteRepository();
const hijoRepository = new HijoRepository();

// Crear instancias de servicios
const leadRepository = new LeadRepository(); // Add this line to create an instance of LeadRepository
const userService = new UserService(userRepository, auditService, leadRepository);
const rabbitMQPublisher = new RabbitMQPublisher();
const tokenService = new TokenService();

const registerUserUseCase = new RegisterUserUseCase(userRepository, userService, rabbitMQPublisher, tokenService);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const readUserUseCase = new ReadUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository, auditService);
const loginUserUseCase = new LoginUserUseCase(userRepository, userService);
const userAuditUseCase = new UserAuditUseCase(userService, auditService);

const registerDocenteUseCase = new RegisterDocenteUseCase(userRepository, docenteRepository);
const registerHijoUseCase = new RegisterHijoUseCase(userRepository, hijoRepository, auditService);
const updateHijoUseCase = new UpdateHijoUseCase(hijoRepository);
const updateDocenteUseCase = new UpdateDocenteUseCase(docenteRepository);

// Crear instancias de controladores
export const registerUserController = new RegisterUserController(registerUserUseCase, auditService);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const readUserController = new ReadUserController(readUserUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase, userAuditUseCase);

export const registerDocenteController = new RegisterDocenteController(registerDocenteUseCase, auditService);
export const registerNiñoController = new RegisterHijoController(registerHijoUseCase);
export const updateNiñoController = new UpdateHijoController(updateHijoUseCase);
export const updateDocenteController = new UpdateDocenteController(updateDocenteUseCase);

// Instancia de controlador de auditoría
export const auditController = new AuditController(auditService);

export const confirmAccountController = new ConfirmAccountController(tokenService, userService);

// Nuevas instancias para docentes
const getAllDocentesUseCase = new GetAllDocentesUseCase(docenteRepository);
const deleteDocenteUseCase = new DeleteDocenteUseCase(docenteRepository);

export const getAllDocentesController = new GetAllDocentesController(getAllDocentesUseCase);
export const deleteDocenteController = new DeleteDocenteController(deleteDocenteUseCase);
