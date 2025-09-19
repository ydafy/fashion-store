import { Router } from 'express';
import { logUserQuestion } from '../controllers/loggingController';

const router = Router();

router.post('/chat', logUserQuestion);

export default router;
