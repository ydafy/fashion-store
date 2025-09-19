import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} from '../controllers/cartController';

const router = Router();

// Ruta para obtener el carrito completo
router.get('/', getCart);

// Ruta para añadir un nuevo item al carrito
router.post('/item', addItemToCart);

// ✨ RUTA ACTUALIZADA: Ahora usa un único 'itemId' para identificar el recurso
router.put('/item/:itemId', updateItemQuantity);

// ✨ RUTA ACTUALIZADA: También usa 'itemId'
router.delete('/item/:itemId', removeItemFromCart);

// Ruta para vaciar el carrito
router.delete('/', clearCart);

export default router;
