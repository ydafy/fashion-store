export interface Address {
  id: string;
  /** @description La relación con el usuario al que pertenece la dirección. Se añadirá en una futura refactorización del módulo de Auth/Direcciones. */
  // userId: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  details?: string;
  instructions?: string;
}
