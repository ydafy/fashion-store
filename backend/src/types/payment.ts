export interface PaymentMethod {
  id: string; // Ej: "pm_1J9X2Y2eZvKYlo2C..."
  token: string;
  brand: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Unknown';
  last4: string; // "4242"
  expMonth: number; // 12
  expYear: number; // 2026
  isDefault: boolean;
  nickname?: string;
}
