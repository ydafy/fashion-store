import { Router } from 'express';
import { getDocument } from '../controllers/documentController';

const router = Router();

router.get('/:documentType', getDocument);

export default router;
