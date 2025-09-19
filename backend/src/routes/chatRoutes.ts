import { Router } from 'express';
import { handleChatQuery } from '../controllers/chatController';

const router = Router();

router.post('/', handleChatQuery);

export default router;
