import { Router } from 'express';
import { NotificationController } from '../in/controllers/notificationController';
import { TokenController } from '../in/controllers/tokenController';

const router = Router();

const notificationController = new NotificationController();
const tokenController = new TokenController();

router.post('/v1/send-email', notificationController.sendEmail.bind(notificationController));

router.post('/v1/token', tokenController.createToken.bind(tokenController));

router.post('/v1/token/validate', tokenController.confirmAccount.bind(tokenController));

export default router;
