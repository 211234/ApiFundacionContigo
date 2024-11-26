import { Router } from 'express';
import {
    createLeadController,
    confirmLeadController,
    rejectLeadController,
    getLeadsController
} from './leadDependencies';

const router = Router();

router.post('/v1/leads', (req, res, next) => createLeadController.handle(req, res, next));
router.post('/v1/leads/confirm', (req, res, next) => confirmLeadController.handle(req, res, next));
router.post('/v1/leads/reject', (req, res, next) => rejectLeadController.handle(req, res, next));
router.get('/v1/leads', (req, res, next) => getLeadsController.handle(req, res, next));

export default router;
