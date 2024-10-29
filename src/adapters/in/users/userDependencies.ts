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

// Importaciones específicas para Niño
import { RegisterNiñoUseCase } from '../../../application/users/use-cases/registerNiñoUseCase';
import { RegisterNiñoController } from './controllers/registerNiñoController';
import { NiñoRepository } from '../../out/database/users/niñoRepository';

// Crear instancias de repositorio y servicio de usuario
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// Crear instancias de repositorios y servicios de docentes y niños
const docenteRepository = new DocenteRepository();
const niñoRepository = new NiñoRepository();

// Crear instancias de casos de uso con sus respectivas dependencias
const registerUserUseCase = new RegisterUserUseCase(userRepository, userService);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const readUserUseCase = new ReadUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, userService);

// Crear instancias de casos de uso específicos para docentes y niños
const registerDocenteUseCase = new RegisterDocenteUseCase(userRepository, docenteRepository);
const registerNiñoUseCase = new RegisterNiñoUseCase(userRepository, niñoRepository);

// Crear instancias de controladores para cada caso de uso
export const registerUserController = new RegisterUserController(registerUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const readUserController = new ReadUserController(readUserUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase);

// Controlador para el registro de docentes y niños
export const registerDocenteController = new RegisterDocenteController(registerDocenteUseCase);
export const registerNiñoController = new RegisterNiñoController(registerNiñoUseCase);
