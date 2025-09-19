import { CartItem } from '../types/cart';
import { userCart } from '../database/inMemoryStore';

/**
 * @description Genera un ID único para un ítem del carrito basado en sus componentes.
 * @param item - El ítem del carrito.
 * @returns Un string que es el ID único.
 */
const generateCartItemId = (item: CartItem): string => {
  return `${item.productId}-${item.variantId}-${item.inventoryId}`;
};

/**
 * @description Obtiene todos los items del carrito.
 * @returns El array de items del carrito.
 */
export const getCartItems = (): CartItem[] => {
  return userCart;
};

/**
 * @description Añade un item al carrito o incrementa su cantidad si ya existe.
 * @param newItem - El item a añadir.
 * @returns Un objeto que contiene el item y un booleano 'created' que es true si el item era nuevo.
 */
export const addItem = (
  newItem: CartItem
): { item: CartItem; created: boolean } => {
  const newItemId = generateCartItemId(newItem);
  const existingItemIndex = userCart.findIndex(
    (item) => generateCartItemId(item) === newItemId
  );

  if (existingItemIndex > -1) {
    // El item ya existe, actualizamos su cantidad
    userCart[existingItemIndex].quantity += newItem.quantity;
    return { item: userCart[existingItemIndex], created: false };
  } else {
    // Es un item nuevo, lo añadimos al carrito
    userCart.push(newItem);
    return { item: newItem, created: true };
  }
};

/**
 * @description Actualiza la cantidad de un item específico.
 * @param itemId - El ID único del item a actualizar.
 * @param newQuantity - La nueva cantidad.
 * @returns El item actualizado o null si no se encontró.
 */
export const updateQuantity = (
  itemId: string,
  newQuantity: number
): CartItem | null => {
  const itemIndex = userCart.findIndex(
    (item) => generateCartItemId(item) === itemId
  );

  if (itemIndex === -1) {
    return null; // No se encontró el item
  }

  userCart[itemIndex].quantity = newQuantity;
  return userCart[itemIndex];
};

/**
 * @description Elimina un item específico del carrito.
 * @param itemId - El ID único del item a eliminar.
 * @returns true si el item fue eliminado, false si no se encontró.
 */
export const removeItem = (itemId: string): boolean => {
  const initialLength = userCart.length;
  // Filtramos el array para crear uno nuevo sin el item a eliminar
  const updatedCart = userCart.filter(
    (item) => generateCartItemId(item) !== itemId
  );

  if (updatedCart.length < initialLength) {
    // Reemplazamos el contenido del array original con el nuevo
    userCart.splice(0, userCart.length, ...updatedCart);
    return true;
  }
  return false;
};

/**
 * @description Vacía completamente el carrito.
 */
export const clearAllItems = (): void => {
  userCart.splice(0, userCart.length);
};
