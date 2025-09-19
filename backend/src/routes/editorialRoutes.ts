import { Router } from 'express';
import { getEditorialsController } from '../controllers/editorialController';

const router = Router();

router.get('/', getEditorialsController);

export default router;
