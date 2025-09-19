import { Router } from 'express';
import {
  submitFaqFeedback,
  getFaqStats
} from '../controllers/feedbackController';

const router = Router();

router.post('/faq', submitFaqFeedback);
router.get('/faq-stats', getFaqStats);

export default router;
