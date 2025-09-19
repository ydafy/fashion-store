import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus } from '../types/order';
import { userOrders } from '../database/inMemoryStore';

type CreateOrderData = Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

/**
 * @description Obtiene todos los pedidos del almacén de datos.
 */
export const findAllOrders = (): Order[] => {
  return userOrders;
};

/**
 * @description Busca un pedido por su ID.
 */
export const findOrderById = (id: string): Order | undefined => {
  return userOrders.find((o) => o.id === id);
};

/**
 * @description Crea un nuevo pedido y simula su envío después de un tiempo.
 */
export const createOrder = (data: CreateOrderData): Order => {
  const newOrder: Order = {
    id: `order-${uuidv4()}`, // Usamos un prefijo para mayor claridad
    ...data,
    status: 'processing', // ✨ 1. TODO pedido nuevo empieza como "Procesando"
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Añadimos el nuevo pedido al principio de la lista para que aparezca primero
  userOrders.unshift(newOrder);

  // ✨ 2. SIMULAMOS EL PROCESO DE ENVÍO DE FORMA ASÍNCRONA
  // Esto ocurrirá "en segundo plano" después de que la respuesta inicial se haya enviado.
  if (newOrder.shippingMethod === 'delivery') {
    // Después de 15 segundos, simulamos que el pedido ha sido empaquetado y enviado.
    setTimeout(() => {
      // Buscamos el pedido en el array por si acaso (aunque siempre debería estar)
      const orderInDb = userOrders.find((o) => o.id === newOrder.id);

      if (orderInDb) {
        console.log(`[Order Simulation] Shipping order ${orderInDb.id}...`);

        // Actualizamos el estado y añadimos los datos de seguimiento
        orderInDb.status = 'shipped';
        orderInDb.updatedAt = new Date().toISOString();
        orderInDb.shippingProvider = 'DHL Express (Sim.)';
        orderInDb.trackingNumber = `DHL${Math.floor(
          1000000000 + Math.random() * 9000000000
        )}`;
        // No ponemos 'trackingUrl' para que la lógica de fallback del frontend se active
      }
    }, 15000); // 15 segundos de retardo
  }

  return newOrder;
};
