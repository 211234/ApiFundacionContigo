import { CreateCitaMedicaUseCase } from '../../../application/citas/use-case/createCitaMedicaUseCase';
import { GetCitasByUserIdUseCase } from '../../../application/citas/use-case/getCitasByUserIdUseCase';
import { UpdateCitaMedicaUseCase } from '../../../application/citas/use-case/updateCitaMedicaUseCase';
import { DeleteCitaMedicaUseCase } from '../../../application/citas/use-case/deleteCitaMedicaUseCase';
import { CitaMedicaRepository } from '../../../adapters/out/database/citas/citaMedicaRepository';
import { CreateCitaMedicaController } from '../citas/controllers/createCitaMedicaController';
import { GetCitasByUserIdController } from '../citas/controllers/getCitasByUserIdController';
import { UpdateCitaMedicaController } from '../citas/controllers/updateCitaMedicaController';
import { DeleteCitaMedicaController } from '../citas/controllers/deleteCitaMedicaController';
import { AuditService } from '../../../core/users/services/auditService';
import { AuditRepository } from '../../../core/users/repositories/auditRepository';

const citaMedicaRepository = new CitaMedicaRepository();

const auditRepository = new AuditRepository();
const auditService = new AuditService(auditRepository);

// Casos de uso
const createCitaMedicaUseCase = new CreateCitaMedicaUseCase(citaMedicaRepository);
const getCitasByUserIdUseCase = new GetCitasByUserIdUseCase(citaMedicaRepository);
const updateCitaMedicaUseCase = new UpdateCitaMedicaUseCase(citaMedicaRepository);
const deleteCitaMedicaUseCase = new DeleteCitaMedicaUseCase(citaMedicaRepository);

// Controladores
export const createCitaMedicaController = new CreateCitaMedicaController(createCitaMedicaUseCase, auditService);
export const getCitasByUserIdController = new GetCitasByUserIdController(getCitasByUserIdUseCase);
export const updateCitaMedicaController = new UpdateCitaMedicaController(updateCitaMedicaUseCase, auditService);
export const deleteCitaMedicaController = new DeleteCitaMedicaController(deleteCitaMedicaUseCase, auditService);

// Exportar instancias de controladores
export const citaMedicaDependencies = {
    createCitaMedicaController,
    getCitasByUserIdController,
    updateCitaMedicaController,
    deleteCitaMedicaController,
};
