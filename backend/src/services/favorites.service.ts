import { userFavorites } from '../database/inMemoryStore';
// ✨ 1. Importamos los tipos desde su archivo dedicado
import { FavoriteEntry } from '../types/favorite';

// ✨ 2. El tipo para el identificador ahora usa FavoriteEntry, es más limpio
type FavoriteIdentifier = FavoriteEntry & { userId: string };

/**
 * @description Obtiene los favoritos para un usuario específico.
 * @param userId - El ID del usuario.
 * @returns Un array de las entradas de favoritos del usuario.
 */
export const findFavoritesByUserId = (userId: string): FavoriteEntry[] => {
  return userFavorites[userId] || [];
};

/**
 * @description Añade un nuevo favorito para un usuario si no existe.
 * @param identifier - Objeto con userId, productId y variantId.
 * @returns La entrada de favorito, ya sea la nueva o la que ya existía.
 */
export const addFavorite = (identifier: FavoriteIdentifier): FavoriteEntry => {
  const { userId, productId, variantId } = identifier;

  if (!userFavorites[userId]) {
    userFavorites[userId] = [];
  }

  const existingFavorite = userFavorites[userId].find(
    (fav) => fav.productId === productId && fav.variantId === variantId
  );

  if (existingFavorite) {
    return existingFavorite;
  }

  const newFavoriteEntry: FavoriteEntry = {
    productId,
    variantId,
    dateAdded: new Date().toISOString()
  };
  userFavorites[userId].push(newFavoriteEntry);
  return newFavoriteEntry;
};

/**
 * @description Elimina un favorito específico de un usuario.
 * @param identifier - Objeto con userId, productId y variantId.
 * @returns true si se eliminó un favorito, false si no se encontró.
 */
export const removeFavorite = (identifier: FavoriteIdentifier): boolean => {
  const { userId, productId, variantId } = identifier;

  if (!userFavorites[userId]) {
    return false;
  }

  const initialLength = userFavorites[userId].length;
  const updatedFavorites = userFavorites[userId].filter(
    (fav) => !(fav.productId === productId && fav.variantId === variantId)
  );

  if (updatedFavorites.length < initialLength) {
    userFavorites[userId] = updatedFavorites;
    return true;
  }

  return false;
};
