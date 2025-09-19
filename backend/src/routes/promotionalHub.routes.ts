import { Router } from 'express';
import { getPromotionalHubs } from '../controllers/promotionalHub.controller';

const router = Router();

// Ruta para obtener todos los hubs promocionales
router.get('/', getPromotionalHubs);

export default router;
