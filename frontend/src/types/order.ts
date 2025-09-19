import { CartItem } from './cart';
import { Address } from './address';

// Este tipo debería vivir en checkout.ts, pero lo dejamos aquí por ahora si no existe.
export interface PickupLocation {
  id: string;
  name: string;
  address: string;
  hours: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'unknown';
export type ShippingMethod = 'delivery' | 'pickup';

interface OrderPickupContact {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[]; // ✨ Usa nuestro tipo CartItem refactorizado
  status: OrderStatus;
  shippingMethod: ShippingMethod;
  shippingAddress?: Address;
  pickupLocation?: PickupLocation;
  pickupContact?: OrderPickupContact;

  // Resumen de costos
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;

  // Timestamps
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601

  // Información de envío (opcional)
  shippingProvider?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}
