import { Router } from 'express';
import { getFeaturedSaleController } from '../controllers/featuredSaleController';

const router = Router();

// La ruta será GET /api/featured-sale/products
router.get('/products', getFeaturedSaleController);

export default router;
