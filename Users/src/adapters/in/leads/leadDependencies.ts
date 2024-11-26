import { LeadRepository } from '../../../adapters/out/database/lead/leadRepository';
import { CreateLeadUseCase } from '../../../application/lead/use-cases/createLeadUseCase';
import { ConfirmLeadUseCase } from '../../../application/lead/use-cases/confirmLeadUseCase';
import { RejectLeadUseCase } from '../../../application/lead/use-cases/rejectLeadUseCase';
import { GetLeadsUseCase } from '../../../application/lead/use-cases/getLeadsUseCase';

import { CreateLeadController } from './controllers/createLeadController';
import { ConfirmLeadController } from './controllers/confirmLeadController';
import { RejectLeadController } from './controllers/rejectLeadController';
import { GetLeadsController } from './controllers/getLeadsController';

// Repositorio
const leadRepository = new LeadRepository();

// Casos de Uso
const createLeadUseCase = new CreateLeadUseCase(leadRepository);
const confirmLeadUseCase = new ConfirmLeadUseCase(leadRepository);
const rejectLeadUseCase = new RejectLeadUseCase(leadRepository);
const getLeadsUseCase = new GetLeadsUseCase(leadRepository);

// Controladores
const createLeadController = new CreateLeadController(createLeadUseCase);
const confirmLeadController = new ConfirmLeadController(confirmLeadUseCase);
const rejectLeadController = new RejectLeadController(rejectLeadUseCase);
const getLeadsController = new GetLeadsController(getLeadsUseCase);

// Exportar instancias
export {
    createLeadController,
    confirmLeadController,
    rejectLeadController,
    getLeadsController
};
