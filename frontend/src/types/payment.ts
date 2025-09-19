export interface PaymentMethod {
  id: string;
  token: string; // ✨ AÑADIDO: El token seguro del proveedor de pagos
  brand: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Unknown';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  nickname?: string; // ✨ AÑADIDO: El sobrenombre opcional
}
