export const COLORS = {
  // Core Theme Colors
  primaryBackground: '#f9f6ee',
  primaryText: '#222121',
  secondaryText: '#555',
  accent: '#0E79B2',
  accentLow: '#D9DDDE',
  white: '#ffffff',
  beige: '#f5f5dc',

  // UI Elements
  borderDefault: '#d0d0d0',
  // borderSelected: '#222121', // Comentaste que no lo usas como borde
  lightGray: '#f0f0f0', // Usado para fondos, placeholders
  separator: '#e0e0e0',
  warningBackground: '#E6E6E6',
  info: '#222121',

  // Feedback & Status
  error: '#EF4444',
  success: '#10B981', // Podrías renombrar deliveredEmerald a success si es más genérico
  successDark: '#166c18',
  warning: '#F59E0B', // Podrías renombrar pendingYellow o badgeLowStock a warning
  delivered: '#10B981',

  // Order Status Specific
  orderProcessing: '#3B82F6', // processingSkyBlue
  orderPending: '#F59E0B', // pendingYellow
  orderShipped: '#4F46E5', // shippedIndigo
  orderDelivered: '#10B981', // deliveredEmerald
  orderCancelled: '#EF4444', // cancelledTomato (igual a error)

  // Badge Specific
  badgeNew: '#10B981', // Igual a success/orderDelivered
  badgeSale: '#dc3545', // Un rojo diferente a error
  badgeTopSeller: '#4F46E5', // Igual a orderShipped
  badgeLowStock: '#F59E0B', // Igual a warning/orderPending
  badgeOutOfStock: '#555', // Igual a secondaryText
};
