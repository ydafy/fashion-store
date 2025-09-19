import { useQuery } from '@tanstack/react-query';
import * as orderService from '../services/order';

/**
 * @description Hook para obtener los detalles de un pedido específico por su ID.
 * Maneja el fetching, caching, y los estados de carga/error automáticamente.
 * @param {string} orderId - El ID del pedido que se desea obtener.
 */
export const useOrderDetails = (orderId: string) => {
  return useQuery({
    // La 'queryKey' es un array que identifica unívocamente esta pieza de datos.
    // Incluir el 'orderId' asegura que cada detalle de pedido se cachee por separado.
    queryKey: ['orderDetails', orderId],

    // La 'queryFn' es la función asíncrona que obtiene los datos.
    // TanStack Query le pasa automáticamente el 'queryKey' como parte del objeto de contexto.
    queryFn: () => orderService.getOrderById(orderId),

    // 'enabled' es una opción muy potente. Le decimos a la query que no se ejecute
    // si por alguna razón el 'orderId' es nulo o indefinido.
    enabled: !!orderId,
  });
};
