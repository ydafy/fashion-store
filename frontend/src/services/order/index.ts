import { API_BASE_URL } from '../../config/api';
import { Order } from '../../types/order'; // Asegúrate que la ruta al tipo sea correcta

// Definimos un tipo para la carga útil (payload) para mayor seguridad.
// Usamos Omit para crear un nuevo tipo a partir de Order, excluyendo las propiedades
// que el backend genera automáticamente.
type CreateOrderPayload = Omit<
  Order,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

/**
 * Envía una solicitud para crear un nuevo pedido.
 * @param orderPayload Los datos del pedido a crear.
 * @param token El token de autenticación del usuario (opcional, pero recomendado para el futuro).
 * @returns Una promesa que se resuelve con el objeto Order completo creado por el backend.
 * @throws Un error si la respuesta de la red no es exitosa.
 */
export const createOrder = async (
  orderPayload: CreateOrderPayload,
  token?: string
): Promise<Order> => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    // En el futuro, cuando tu API requiera autenticación, este bloque añadirá el token.
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload)
    });

    // Leemos la respuesta SIEMPRE para poder acceder al mensaje de error si lo hay.
    const responseData = await response.json();

    if (!response.ok) {
      // El backend debería enviar un mensaje de error en la propiedad 'message'.
      throw new Error(
        responseData.message ||
          `Network response was not ok: ${response.status}`
      );
    }

    // Si todo fue bien, el responseData es nuestro objeto Order creado.
    return responseData as Order;
  } catch (error) {
    console.error('[OrderService] Error creating order:', error);
    // Re-lanzamos el error.
    throw error;
  }
};

/**
 * @description Obtiene los detalles de un pedido específico por su ID.
 * @param orderId - El ID del pedido a obtener.
 * @param token - El token de autenticación del usuario (opcional).
 * @returns Una promesa que se resuelve con el objeto Order.
 */
export const getOrderById = async (
  orderId: string,
  token?: string
): Promise<Order> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    headers
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch order details');
  }
  return responseData;
};

// --- ✨NUEVA FUNCIÓN ✨ ---

/**
 * @description Obtiene todos los pedidos y los filtra por el ID de usuario proporcionado.
 * En un backend real, el filtrado se haría en el servidor.
 * @param userId - El ID del usuario para el cual obtener los pedidos.
 * @param token - El token de autenticación del usuario (opcional).
 * @returns Una promesa que se resuelve con un array de los pedidos del usuario.
 */
export const getOrdersForUser = async (
  userId: string,
  token?: string
): Promise<Order[]> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // En nuestra simulación, el endpoint /api/orders devuelve TODOS los pedidos.
  const response = await fetch(`${API_BASE_URL}/api/orders`, { headers });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch orders');
  }

  // Filtramos en el frontend como parte de la simulación.
  const allOrders: Order[] = responseData;
  const userOrders = allOrders.filter((order) => order.userId === userId);

  return userOrders;
};
