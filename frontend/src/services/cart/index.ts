import { API_BASE_URL } from '../../config/api';
import { CartItem } from '../../types/cart';

// --- Función Helper para Errores (sin cambios) ---
const handleCartError = async (response: Response, defaultMessage: string) => {
  // Maneja casos donde no hay cuerpo que parsear
  if ([204, 404].includes(response.status)) return;
  try {
    const data = await response.json();
    throw new Error(data.message || defaultMessage);
  } catch (e) {
    throw new Error(defaultMessage);
  }
};

// --- Funciones del Servicio Refactorizadas ---

/**
 * @description Obtiene todos los items del carrito desde la API.
 * @returns Una promesa que se resuelve con un array de CartItem.
 */
export const getCart = async (): Promise<CartItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/cart`);
  if (!response.ok) {
    await handleCartError(response, 'Failed to fetch cart');
  }
  // Asumimos que la respuesta siempre será un array, incluso si está vacío.
  return response.json();
};

/**
 * @description Añade un nuevo item al carrito.
 * @param newItem - El objeto CartItem completo a añadir.
 * @returns Una promesa que se resuelve con el item añadido.
 */
export const addToCart = async (newItem: CartItem): Promise<CartItem> => {
  const response = await fetch(`${API_BASE_URL}/api/cart/item`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem)
  });
  if (!response.ok) {
    await handleCartError(response, 'Failed to add item to cart');
  }
  return response.json();
};

/**
 * @description Actualiza la cantidad de un item específico en el carrito.
 * @param itemId - El ID único del ítem en el carrito (ej. 'prod-1-var-1-inv-1').
 * @param newQuantity - La nueva cantidad.
 * @returns Una promesa que se resuelve con el item actualizado.
 */
export const updateItemQuantity = async (
  itemId: string,
  newQuantity: number
): Promise<CartItem> => {
  // ✨ La URL ahora usa el itemId, que es más estándar para una API REST.
  const response = await fetch(`${API_BASE_URL}/api/cart/item/${itemId}`, {
    method: 'PUT', // o 'PATCH'
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: newQuantity })
  });
  if (!response.ok) {
    await handleCartError(response, 'Failed to update quantity');
  }
  return response.json();
};

/**
 * @description Elimina un item específico del carrito.
 * @param itemId - El ID único del ítem en el carrito.
 */
export const removeFromCart = async (itemId: string): Promise<void> => {
  // ✨ La URL ahora usa el itemId para la operación DELETE.
  const response = await fetch(`${API_BASE_URL}/api/cart/item/${itemId}`, {
    method: 'DELETE'
  });
  // 204 No Content es una respuesta exitosa para DELETE.
  if (!response.ok && response.status !== 204) {
    await handleCartError(response, 'Failed to remove item from cart');
  }
};

/**
 * @description Vacía completamente el carrito.
 */
export const clearCart = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'DELETE'
  });
  if (!response.ok && response.status !== 204) {
    await handleCartError(response, 'Failed to clear cart');
  }
};
