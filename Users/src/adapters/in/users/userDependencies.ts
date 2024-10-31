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

// Importaciones específicas para Niño
import { RegisterHijoUseCase } from '../../../application/users/use-cases/registerHijoUseCase';
import { RegisterNiñoController } from './controllers/registerHijoController';
import { HijoRepository } from '../../out/database/users/hijoRepository';
import { UpdateHijoUseCase } from '../../../application/users/use-cases/updateHijoUseCase';
import { UpdateNiñoController } from './controllers/updateHijoController';
import { UpdateDocenteUseCase } from '../../../application/users/use-cases/updateDocenteUseCase';

// Crear instancias de repositorio y servicio de usuario
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// Crear instancias de repositorios y servicios de docentes y niños
const docenteRepository = new DocenteRepository();
const hijoRepository = new HijoRepository();

// Crear instancias de casos de uso con sus respectivas dependencias
const registerUserUseCase = new RegisterUserUseCase(userRepository, userService);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const readUserUseCase = new ReadUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository, userService);

// Crear instancias de casos de uso específicos para docentes y niños
const registerDocenteUseCase = new RegisterDocenteUseCase(userRepository, docenteRepository);
const registerNiñoUseCase = new RegisterHijoUseCase(userRepository, hijoRepository);
const updateNiñoUseCase = new UpdateHijoUseCase(hijoRepository);
const updateDocenteUseCase = new UpdateDocenteUseCase(docenteRepository);

// Crear instancias de controladores para cada caso de uso
export const registerUserController = new RegisterUserController(registerUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const readUserController = new ReadUserController(readUserUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const loginUserController = new LoginUserController(loginUserUseCase);

// Controlador para el registro de docentes y niños
export const registerDocenteController = new RegisterDocenteController(registerDocenteUseCase);
export const registerNiñoController = new RegisterNiñoController(registerNiñoUseCase);
export const updateNiñoController = new UpdateNiñoController(updateNiñoUseCase);
export const updateDocenteController = new UpdateDocenteController(updateDocenteUseCase);
