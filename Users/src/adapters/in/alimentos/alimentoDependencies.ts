import { CreateAlimentoUseCase } from '../../../application/alimentos/use-cases/createAlimentoUseCase';
import { GetAlimentosByUserIdUseCase } from '../../../application/alimentos/use-cases/getAlimentosByUserIdUseCase';
import { UpdateAlimentoUseCase } from '../../../application/alimentos/use-cases/updateAlimentoUseCase';
import { DeleteAlimentoUseCase } from '../../../application/alimentos/use-cases/deleteAlimentoUseCase';
import { AlimentoRepository } from '../../out/database/alimentos/alimentoRepository';
import { CreateAlimentoController } from './controllers/createAlimentoController';
import { GetAlimentosByUserIdController } from './controllers/getAlimentosByUserIdController';
import { UpdateAlimentoController } from './controllers/updateAlimentoController';
import { DeleteAlimentoController } from './controllers/deleteAlimentoController';
import { AuditService } from '../../../core/users/services/auditService';
import { AuditRepository } from '../../../core/users/repositories/auditRepository';

const alimentoRepository = new AlimentoRepository();
const auditRepository = new AuditRepository();
const auditService = new AuditService(auditRepository);

// Casos de uso
const createAlimentoUseCase = new CreateAlimentoUseCase(alimentoRepository);
const getAlimentosByUserIdUseCase = new GetAlimentosByUserIdUseCase(alimentoRepository);
const updateAlimentoUseCase = new UpdateAlimentoUseCase(alimentoRepository);
const deleteAlimentoUseCase = new DeleteAlimentoUseCase(alimentoRepository);

// Controladores
export const createAlimentoController = new CreateAlimentoController(createAlimentoUseCase, auditService);
export const getAlimentosByUserIdController = new GetAlimentosByUserIdController(getAlimentosByUserIdUseCase);
export const updateAlimentoController = new UpdateAlimentoController(updateAlimentoUseCase, auditService);
export const deleteAlimentoController = new DeleteAlimentoController(deleteAlimentoUseCase, auditService);

// Exportar instancias de controladores
export const alimentoDependencies = {
    createAlimentoController,
    getAlimentosByUserIdController,
    updateAlimentoController,
    deleteAlimentoController,
};
