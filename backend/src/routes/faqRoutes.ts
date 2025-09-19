import { Router } from 'express';
import { getFaqData } from '../controllers/faqController';

const router = Router();

// Esta ruta será simplemente /
router.get('/', getFaqData);

export default router;
