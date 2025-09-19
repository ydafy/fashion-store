import { z } from 'zod';
import {
  isNotEmpty,
  isValidCardNumber,
  isValidExpiryDate,
  isValidCvv,
} from '../../utils/validation';
import { paymentErrorMap } from './paymentErrorMap';

export const paymentSchema = z.object({
  // Campo para el número de tarjeta
  cardNumber: z
    .string()
    .min(1, { message: paymentErrorMap.cardNumberRequired })
    .refine(isValidCardNumber, {
      message: paymentErrorMap.cardNumberInvalid,
    }),

  // Campo para el nombre en la tarjeta
  cardHolderName: z
    .string()
    .min(1, { message: paymentErrorMap.cardHolderNameRequired })
    .refine(isNotEmpty, {
      // Doble validación para asegurar que no sean solo espacios
      message: paymentErrorMap.cardHolderNameRequired,
    }),

  // Campo para la fecha de expiración
  expiryDate: z
    .string()
    .min(1, { message: paymentErrorMap.cardExpiryRequired })
    .refine(isValidExpiryDate, {
      message: paymentErrorMap.cardExpiryInvalid,
    }),

  // Campo para el CVV
  cvv: z
    .string()
    .min(1, { message: paymentErrorMap.cardCvvRequired })
    .refine(isValidCvv, {
      message: paymentErrorMap.cardCvvInvalid,
    }),

  // Campo para el "Sobrenombre" (opcional)
  nickname: z.string().optional(),

  // Checkbox para "Establecer como predeterminada" (opcional)
  isDefault: z.boolean().optional(),
});

// Exportamos el tipo inferido para usarlo en nuestro componente de formulario
export type PaymentFormData = z.infer<typeof paymentSchema>;
