import { Router } from 'express';
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  requestEmailChange,
  confirmEmailChange,
  requestPhoneVerification,
  changePassword
} from '../controllers/authController';

const router = Router();

// Define las rutas para el módulo de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/request-email-change', requestEmailChange);
router.post('/confirm-email-change', confirmEmailChange);
router.post('/request-phone-verification', requestPhoneVerification);
router.post('/change-password', changePassword);

export default router;
