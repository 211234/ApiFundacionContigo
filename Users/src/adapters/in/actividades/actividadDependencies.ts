import { ActividadesRepository } from '../../out/database/actividades/actividadesRepository';
import { EstadoActividadesRepository } from '../../out/database/actividades/estadoActividadesRepository';
import { GetActividadesByUsuarioUseCase } from '../../../application/actividades/use-case/getActividadesByUsuarioUseCase';
import { GetActividadesByDocenteUseCase } from '../../../application/actividades/use-case/getActividadesByDocenteUseCase';
import { UpdateEstadoActividadUseCase } from '../../../application/actividades/use-case/updateEstadoActividadUseCase';
import { GetPadresConHijosUseCase } from '../../../application/actividades/use-case/getPadresConHijosUseCase';
import { UserRepositoryPort } from '../../../application/users/ports/userRepositoryPort';
import { UserRepository } from '../../out/database/users/userRepository';
import { AssignActividadUseCase } from '../../../application/actividades/use-case/assignActividadUseCase';
import { CreateActividadUseCase } from '../../../application/actividades/use-case/createActividadUseCase';
import { AssignActividadController } from './controllers/assignActividadController';
import { CreateActividadController } from './controllers/createActividadController';
import { GetActividadesByUsuarioController } from './controllers/getActividadesByUsuarioController';
import { GetActividadesByDocenteController } from './controllers/getActividadesByDocenteController';
import { GetPadresConHijosController } from './controllers/getPadresConHijosController';
import { UpdateEstadoActividadController } from './controllers/updateEstadoActividadController';
import { EmailService } from '../../out/services/emailService';

// Repositorios
const actividadesRepository = new ActividadesRepository();
const estadoActividadesRepository = new EstadoActividadesRepository();
const userRepository: UserRepositoryPort = new UserRepository();

// Casos de uso
const getPadresConHijosUseCase = new GetPadresConHijosUseCase(userRepository);
const getActividadesByDocenteUseCase = new GetActividadesByDocenteUseCase(actividadesRepository);
const getActividadesByUsuarioUseCase = new GetActividadesByUsuarioUseCase(estadoActividadesRepository);
const updateEstadoActividadUseCase = new UpdateEstadoActividadUseCase(estadoActividadesRepository);
const emailService = new EmailService(); // Instancia del servicio de correos
const assignActividadUseCase = new AssignActividadUseCase(estadoActividadesRepository, userRepository, emailService, actividadesRepository);
const createActividadUseCase = new CreateActividadUseCase(actividadesRepository);

// Controladores
export const getActividadesByUsuarioController = new GetActividadesByUsuarioController(getActividadesByUsuarioUseCase);
export const getActividadesByDocenteController = new GetActividadesByDocenteController(getActividadesByDocenteUseCase);
export const getPadresConHijosController = new GetPadresConHijosController(getPadresConHijosUseCase);
export const updateEstadoActividadController = new UpdateEstadoActividadController(updateEstadoActividadUseCase);
export const assignActividadController = new AssignActividadController(assignActividadUseCase);
export const createActividadController = new CreateActividadController(createActividadUseCase);
