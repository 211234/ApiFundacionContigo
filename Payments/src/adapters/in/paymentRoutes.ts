import { Router, Request, Response } from 'express';

// Importar los controladores y casos de uso necesarios
import { CreatePaymentController } from './controllers/createPaymentController';
import { GetPaymentController } from './controllers/getPaymentController';
import { UpdatePaymentStatusController } from './controllers/updatePaymentStatusController';
import { CapturePaymentController } from './controllers/capturePaymentController';
import { PaypalWebhookController } from './controllers/paypalWebhookController';

// Importar los casos de uso y servicios
import { CreatePaymentUseCase } from '../../application/payments/use-case/createPaymentUseCase';
import { GetPaymentUseCase } from '../../application/payments/use-case/getPaymentUseCase';
import { UpdatePaymentStatusUseCase } from '../../application/payments/use-case/updatePaymentStatusUseCase';
import { CapturePaymentUseCase } from '../../application/payments/use-case/capturePaymentUseCase';
import { PaymentService } from '../../core/payments/services/paymentService';

// Importar repositorios
import { TransaccionesRepository as PaymentRepository } from '../out/database/transacciones/transaccionesRepository';
import { EstadoRepository } from '../../adapters/out/database/estados/estadosRepository';

// Inicializar repositorios
const paymentRepository = new PaymentRepository();
const estadoRepository = new EstadoRepository();

// Inicializar servicios
const paymentService = new PaymentService(paymentRepository, estadoRepository);

// Inicializar casos de uso
const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository, estadoRepository);
const getPaymentUseCase = new GetPaymentUseCase(paymentService);
const updatePaymentStatusUseCase = new UpdatePaymentStatusUseCase(paymentService);
const capturePaymentUseCase = new CapturePaymentUseCase(paymentService);

// Inicializar controladores
const createPaymentController = new CreatePaymentController(createPaymentUseCase);
const getPaymentController = new GetPaymentController(getPaymentUseCase);
const updatePaymentStatusController = new UpdatePaymentStatusController(updatePaymentStatusUseCase);
const capturePaymentController = new CapturePaymentController(capturePaymentUseCase);
const paypalWebhookController = new PaypalWebhookController();

// Crear rutas
const router = Router();

router.post('/v1/payments', createPaymentController.handle.bind(createPaymentController));
router.get('/v1/payments/:id', getPaymentController.handle.bind(getPaymentController));
router.put('/v1/payments/:id/status', updatePaymentStatusController.handle.bind(updatePaymentStatusController));
router.post('/v1/payments/capture/:orderId', capturePaymentController.handle.bind(capturePaymentController));
router.post('/v1/webhook', paypalWebhookController.handle.bind(paypalWebhookController));

export default router;
