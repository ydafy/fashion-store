import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  searchProducts
} from '../controllers/productController';
import { getHeroCarouselProducts } from '../controllers/heroCarouselController';

const router = Router();

router.get('/hero-carousel', getHeroCarouselProducts);
// IMPORTANTE: La ruta más específica ('/search') debe declararse ANTES que la ruta más genérica ('/:productId').
// De lo contrario, Express interpretaría "search" como un valor para "productId".
router.get('/search', searchProducts);

// Ruta para obtener un producto por su ID
router.get('/:productId', getProductById);

// Ruta para obtener todos los productos
router.get('/', getAllProducts);

// Exportamos el router para que el servidor principal pueda usarlo
export default router;
