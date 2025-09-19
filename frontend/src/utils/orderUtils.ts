import { TextStyle } from 'react-native';

import * as PhosphorIcons from 'phosphor-react-native';
import { OrderStatus } from '../types/order'; // ✨ Es buena práctica importar el tipo específico
import { COLORS } from '../constants/colors';

type PhosphorIconName = keyof typeof PhosphorIcons;

// ✨ CAMBIO PRINCIPAL AQUÍ ✨
// El mapa ahora contiene las claves de traducción, no los textos.
export const statusDisplayMap: Record<OrderStatus, string> = {
  pending: 'orders:status.pending',
  processing: 'orders:status.processing',
  shipped: 'orders:status.shipped',
  delivered: 'orders:status.delivered',
  cancelled: 'orders:status.cancelled',
  unknown: 'orders:status.unknown',
};

// Este mapa de estilos está perfecto como lo tienes.
// Asegúrate de que los colores (orderPending, etc.) existan en tu constants/colors.ts
export const statusStyleMap: Record<OrderStatus, TextStyle> = {
  pending: { color: COLORS.orderPending || COLORS.warning },
  processing: { color: COLORS.orderProcessing || COLORS.accent },
  shipped: { color: COLORS.orderShipped || COLORS.delivered },
  delivered: { color: COLORS.orderDelivered || COLORS.success },
  cancelled: { color: COLORS.orderCancelled || COLORS.error },
  unknown: { color: COLORS.secondaryText },
};

// Este mapa de iconos también está perfecto.
export const statusIconMap: Record<OrderStatus, PhosphorIconName> = {
  pending: 'Hourglass',
  processing: 'ClockClockwise',
  shipped: 'RocketLaunch',
  delivered: 'CheckCircle',
  cancelled: 'XCircle',
  unknown: 'Question',
};

// Tu función formatDate, si la tenías aquí, debería moverse a `utils/formatters.ts`
// para mantener todo el formato de datos en un solo lugar.
// Si no la tenías, ignora este comentario.
