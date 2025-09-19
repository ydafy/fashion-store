import { Router } from 'express';
import { getProductsByBatch } from '../controllers/batchController';

const router = Router();

// La ruta ahora será GET /api/batch/products
router.get('/products', getProductsByBatch);

export default router;
