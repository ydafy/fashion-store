import { Request, Response } from 'express';
import * as favoritesService from '../services/favorites.service';

export const getUserFavorites = (req: Request, res: Response): void => {
  const { userId } = req.params;
  console.log(`[FavoritesController] GET para ${userId}`);
  const favorites = favoritesService.findFavoritesByUserId(userId);
  res.status(200).json(favorites);
};

export const addFavorite = (req: Request, res: Response): void => {
  const { userId } = req.params;
  // ✨ 1. Ahora esperamos 'variantId' en el body
  const { productId, variantId } = req.body;
  console.log(`[FavoritesController] POST para ${userId}:`, {
    productId,
    variantId
  });

  if (!productId || !variantId) {
    res.status(400).json({ message: 'productId y variantId son requeridos.' });
    return;
  }

  const favoriteEntry = favoritesService.addFavorite({
    userId,
    productId,
    variantId
  });
  res.status(201).json(favoriteEntry);
};

export const removeFavorite = (req: Request, res: Response): void => {
  const { userId, productId } = req.params;
  // ✨ 2. Ahora esperamos 'variantId' como query parameter
  const { variantId } = req.query;
  console.log(`[FavoritesController] DELETE para ${userId}:`, {
    productId,
    variantId
  });

  if (!variantId) {
    res
      .status(400)
      .json({ message: 'El query parameter variantId es requerido.' });
    return;
  }

  const success = favoritesService.removeFavorite({
    userId,
    productId,
    variantId: String(variantId)
  });

  if (success) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Favorito específico no encontrado.' });
  }
};
