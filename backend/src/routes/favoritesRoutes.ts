import { Router } from 'express';
import {
  getUserFavorites,
  addFavorite,
  removeFavorite
} from '../controllers/favoritesController';

const router = Router({ mergeParams: true }); // ✨ Usamos mergeParams: true ✨

// Define las rutas para el módulo de favoritos
// La ruta base será /api/users/:userId/favorites, por lo que aquí solo definimos las sub-rutas.
router.get('/', getUserFavorites);
router.post('/', addFavorite);
// Para DELETE, el productId es parte de la ruta
router.delete('/:productId', removeFavorite);

export default router;
