import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

// --- Controlador para OBTENER el carrito ---
export const getCart = (req: Request, res: Response): void => {
  console.log('[CartController] GET /api/cart');
  const items = cartService.getCartItems();
  res.status(200).json(items);
};

// --- Controlador para AÑADIR un item ---
export const addItemToCart = (req: Request, res: Response): void => {
  try {
    const newItem = req.body;
    console.log('[CartController] POST /api/cart/item - Recibido:', newItem);

    // Validación básica de la entrada
    if (!newItem?.productId || !newItem.variantId || !newItem.inventoryId) {
      res
        .status(400)
        .json({ message: 'Datos del item inválidos o incompletos.' });
      return;
    }

    // ✨ La lógica de negocio (si el item ya existe, etc.) se delega al servicio
    const { item: resultItem, created } = cartService.addItem(newItem);

    // El servicio nos dice si se creó un nuevo item (201) o se actualizó uno existente (200)
    res.status(created ? 201 : 200).json(resultItem);
  } catch (error: any) {
    console.error('[CartController] POST error:', error);
    res.status(500).json({
      message: error.message || 'Error interno al añadir item al carrito.'
    });
  }
};

// --- ✨ Controlador para ACTUALIZAR la cantidad de un item ---
export const updateItemQuantity = (req: Request, res: Response): void => {
  // Obtenemos el itemId de los parámetros de la ruta
  const { itemId } = req.params;
  // Obtenemos la nueva cantidad del cuerpo de la petición
  const { quantity } = req.body;

  console.log(`[CartController] PUT /api/cart/item/${itemId}`);

  if (typeof quantity !== 'number' || quantity < 0) {
    res.status(400).json({ message: 'Cantidad inválida.' });
    return;
  }

  // Si la cantidad es 0, lo tratamos como una eliminación
  if (quantity === 0) {
    const success = cartService.removeItem(itemId);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Item no encontrado en el carrito.' });
    }
    return;
  }

  // Delegamos la lógica al servicio, pasándole el itemId y la nueva cantidad
  const updatedItem = cartService.updateQuantity(itemId, quantity);

  if (updatedItem) {
    res.status(200).json(updatedItem);
  } else {
    res.status(404).json({ message: 'Item no encontrado en el carrito.' });
  }
};

// --- ✨ Controlador para ELIMINAR un item ---
export const removeItemFromCart = (req: Request, res: Response): void => {
  // Obtenemos el itemId de los parámetros de la ruta
  const { itemId } = req.params;
  console.log(`[CartController] DELETE /api/cart/item/${itemId}`);

  // Delegamos la lógica al servicio, pasándole el itemId
  const success = cartService.removeItem(itemId);

  if (success) {
    res.status(204).send(); // 204 No Content
  } else {
    res.status(404).json({ message: 'Item no encontrado en el carrito.' });
  }
};

// --- Controlador para VACIAR el carrito ---
export const clearCart = (req: Request, res: Response): void => {
  console.log('[CartController] DELETE /api/cart');
  cartService.clearAllItems();
  res.status(204).send();
};
