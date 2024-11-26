import { MedicamentoService } from '../../../core/medicamentos/services/medicamentoService';
import { CreateMedicamentoController } from './controllers/createMedicamento';
import { GetMedicamentoController } from './controllers/getMedicamentos';
import { UpdateMedicamentoController } from './controllers/updateMedicamento';
import { DeleteMedicamentoController } from './controllers/deleteMedicamento';
import { GetAllMedicamentosController } from './controllers/getAllMedicamentosController';
import { MedicamentoRepository } from '../../../adapters/out/database/medicamentos/medicRepository';
import { AuditService } from '../../../core/users/services/auditService';
import { AuditRepository } from '../../../adapters/out/database/users/auditRepository';

import { pool } from '../../../infrastructure/config/database';
import { UserRepository } from '../../../adapters/out/database/users/userRepository';

const userRepository = new UserRepository();
const auditRepository = new AuditRepository(pool, userRepository);
const auditService = new AuditService(auditRepository);
const medicamentoRepository = new MedicamentoRepository();
const medicamentoService = new MedicamentoService(medicamentoRepository, auditService);

// Instancia de los controladores
export const createMedicamentoController = new CreateMedicamentoController(medicamentoService, auditService);
export const getMedicamentoController = new GetMedicamentoController(medicamentoService);
export const updateMedicamentoController = new UpdateMedicamentoController(medicamentoService, auditService);
export const deleteMedicamentoController = new DeleteMedicamentoController(medicamentoService, auditService);
export const getAllMedicamentosController = new GetAllMedicamentosController(medicamentoService);
