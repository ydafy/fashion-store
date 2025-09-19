import { z } from 'zod';
import { checkoutErrorMap } from './checkoutErrorMap';

import {
  isValidCardNumber,
  isValidExpiryDate,
  isValidCvv,
} from '../../utils/validation';

// Esquema base que se aplica a todos los campos del formulario
export const checkoutSchema = z
  .object({
    shippingMethod: z.enum(['delivery', 'pickup']),
    pickupLocationId: z.string().optional(),
    pickupName: z.string().optional(),
    pickupEmail: z.string().optional(),
    pickupPhone: z.string().optional(),

    // ✨ 1. AÑADIMOS EL CAMPO QUE FALTABA
    paymentMethod: z.enum(['card']),

    // --- ✨ 1. NUEVOS CAMPOS PARA CONTROLAR EL FLUJO DE PAGO ---
    /**
     * Define si el usuario está usando una tarjeta guardada o introduciendo una nueva.
     */
    paymentSelection: z.enum(['saved', 'new']),
    /**
     * El ID de la tarjeta guardada que el usuario ha seleccionado.
     */
    selectedCardId: z.string().optional(),

    // --- ✨ 2. HACEMOS LOS CAMPOS DE LA TARJETA OPCIONALES A NIVEL BASE ---
    // La lógica de si son requeridos se moverá a .superRefine.
    cardHolderName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),

    saveCard: z.boolean().optional(),
    // Ya no necesitamos setDefaultCard, lo simplificamos a solo 'saveCard'
  })
  .superRefine((data, ctx) => {
    // ✨ CAMBIO 2: Añadimos la lógica de validación condicional para los campos de recogida.
    if (data.shippingMethod === 'pickup') {
      // Validar que se seleccionó una ubicación
      if (!data.pickupLocationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pickupLocationId'],
          message: checkoutErrorMap.pickupLocationRequired,
        });
      }

      // Validar nombre para recogida
      if (!data.pickupName || data.pickupName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pickupName'],
          message: checkoutErrorMap.nameRequired,
        });
      }

      // Validar email para recogida
      if (!data.pickupEmail || data.pickupEmail.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pickupEmail'],
          message: checkoutErrorMap.emailRequired,
        });
      } else if (!z.string().email().safeParse(data.pickupEmail).success) {
        // Usamos z.string().email() para validar el formato aquí
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pickupEmail'],
          message: checkoutErrorMap.emailInvalid,
        });
      }

      // Validar teléfono para recogida
      if (!data.pickupPhone || data.pickupPhone.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pickupPhone'],
          message: checkoutErrorMap.phoneRequired, // "Teléfono es requerido"
        });
      } else {
        const sanitizedPhone = data.pickupPhone.replace(/\D/g, '');
        if (sanitizedPhone.length !== 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['pickupPhone'],
            message: checkoutErrorMap.phoneInvalid, // Nuevo mensaje de error
          });
        }
      }
    }

    // No es necesario un 'else', porque si el método es 'delivery',
    // simplemente no se ejecutan estas validaciones.

    // --- ✨ 3. NUEVA LÓGICA DE VALIDACIÓN CONDICIONAL PARA PAGOS ---
    if (data.paymentSelection === 'new') {
      // Si el usuario está añadiendo una nueva tarjeta, validamos cada campo.
      if (!data.cardHolderName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardHolderName'],
          message: checkoutErrorMap.cardHolderNameRequired,
        });
      }
      if (!data.cardNumber || !isValidCardNumber(data.cardNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardNumber'],
          message: checkoutErrorMap.cardNumberInvalid,
        });
      }
      if (!data.cardExpiry || !isValidExpiryDate(data.cardExpiry)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardExpiry'],
          message: checkoutErrorMap.cardExpiryInvalid,
        });
      }
      if (!data.cardCvv || !isValidCvv(data.cardCvv)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['cardCvv'],
          message: checkoutErrorMap.cardCvvInvalid,
        });
      }
    }

    if (data.paymentSelection === 'saved') {
      // Si el usuario eligió pagar con una tarjeta guardada, nos aseguramos de que haya seleccionado una.
      if (!data.selectedCardId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['selectedCardId'], // Aunque no tengamos un campo visible, podemos añadir el error
          message: checkoutErrorMap.savedCardRequired, // Nueva clave de traducción
        });
      }
    }
  });

// Exportamos el tipo inferido para usarlo en nuestro componente
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
