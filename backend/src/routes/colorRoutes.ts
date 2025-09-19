import { Router } from 'express';
import { getFeaturedColorsController } from '../controllers/colorController';

const router = Router();

router.get('/featured', getFeaturedColorsController);

export default router;
