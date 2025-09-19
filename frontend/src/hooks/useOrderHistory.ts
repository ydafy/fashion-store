import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import * as orderService from '../services/order';
import { Order } from '../types/order';

/**
 * @description Un custom hook que maneja la lógica para obtener el historial de pedidos de un usuario.
 * @returns El estado de los pedidos, carga, errores y una función para reintentar.
 */
export const useOrderHistory = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setError('User not authenticated.'); // Este error no se mostrará al usuario
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const userOrders = await orderService.getOrdersForUser(
        user.id,
        token ?? undefined
      );
      // Ordenamos los pedidos del más reciente al más antiguo
      userOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(userOrders);
    } catch (e: any) {
      setError(e.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // useFocusEffect se asegura de que la lista se actualice cada vez que la pantalla obtiene el foco.
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  return {
    orders,
    loading,
    error,
    retryFetch: fetchOrders // Exponemos la función para el botón de reintentar
  };
};
