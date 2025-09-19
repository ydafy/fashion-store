import { Router } from 'express';
import {
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '../controllers/paymentController';

const router = Router();

router.get('/', getPaymentMethods);
router.post('/', addPaymentMethod);
router.delete('/:methodId', deletePaymentMethod);
router.post('/:methodId/set-default', setDefaultPaymentMethod);

export default router;
