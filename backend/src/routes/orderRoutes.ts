import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder
} from '../controllers/orderController';

const router = Router();

// Define las rutas para el módulo de pedidos
router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/:orderId', getOrderById);

export default router;
