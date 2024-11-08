// notificationRoutes.ts
import { Router } from 'express';
import { NotificationController } from '../in/controllers/notificationController';

const router = Router();
const notificationController = new NotificationController();

// Ruta para enviar un correo de notificación manualmente
router.post('/send-email', (req, res) => notificationController.sendEmailNotification(req, res));

export default router;
