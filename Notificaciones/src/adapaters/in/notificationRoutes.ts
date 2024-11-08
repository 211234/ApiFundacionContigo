import { Router } from 'express';
import { NotificationController } from '../in/controllers/notificationController';
import { TokenController } from '../in/controllers/tokenController';

const router = Router();

const notificationController = new NotificationController();
const tokenController = new TokenController();

// Ruta para enviar un correo de notificación manualmente
router.post('/v1/send-email', notificationController.sendEmailNotification.bind(notificationController));

// Ruta para crear un token
router.post('/v1/token', tokenController.createToken.bind(tokenController));

export default router;
