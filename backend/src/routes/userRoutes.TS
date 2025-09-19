import { Router } from 'express';
import { updateUserProfile } from '../controllers/userController'; // Crearemos esto ahora

const router = Router();

// Usaremos PUT para una actualización completa del perfil
router.put('/profile', updateUserProfile);

export default router;
