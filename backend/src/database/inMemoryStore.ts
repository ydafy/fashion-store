import { Address } from '../types/address';
import { CartItem } from '../types/cart';

import { Order } from '../types/order';
import { User } from '../types/auth';
import initialAddressesData from '../data/addresses.json';
import { FavoriteEntry } from '../types/favorite';

import { PaymentMethod } from '../types/payment';
import initialPaymentMethods from '../data/paymentMethods.json';

export let addressesData: Address[] = [...initialAddressesData];
export let userCart: CartItem[] = [];
export let userOrders: Order[] = [];
export let users: User[] = [
  {
    id: 'testuser001',
    name: 'Usuario Test',
    email: 'test@test.com',
    password: 'password',
    phone: {
      number: '5551234567',
      countryCode: 'US',
      callingCode: '1'
    },
    isEmailVerified: true
  }
];

// --- ✨ SECCIÓN DE FAVORITOS  ✨ ---

// 1. El tipo del objeto ahora usa 'FavoriteEntry[]', que ya tiene 'variantId'.
export let userFavorites: Record<string, FavoriteEntry[]> = {
  testuser001: [
    // 2. Los datos ahora usan la clave 'variantId' en lugar de 'colorCode'.
    // Los valores son los IDs de las variantes de tu products.json.
    { productId: 'prod-1', variantId: 'var-1-rosa' },
    { productId: 'prod-2', variantId: 'var-2-negro' }
  ]
};

export let userPaymentMethods: Record<string, PaymentMethod[]> =
  initialPaymentMethods as Record<string, PaymentMethod[]>;
