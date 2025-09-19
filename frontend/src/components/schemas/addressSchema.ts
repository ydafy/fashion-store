import { z } from 'zod';

import { addressErrorMap } from './addressErrorMap';
import { isValidPhoneNumber, isValidPostalCode } from '../../utils/validation';

export const addressSchema = z.object({
  label: z.string().min(1, { message: addressErrorMap.labelRequired }),
  recipientName: z
    .string()
    .min(1, { message: addressErrorMap.recipientNameRequired }),

  // ✨ 2. USAMOS .refine() Y EL ERROR MAP
  phone: z
    .string()
    .min(1, { message: addressErrorMap.phoneRequired })
    .refine(isValidPhoneNumber, { message: addressErrorMap.phoneInvalid }),

  street: z.string().min(1, { message: addressErrorMap.streetRequired }),
  details: z.string().optional(),

  city: z
    .string()
    .nullable()
    .refine((val) => val && val.length > 0, {
      message: addressErrorMap.cityRequired,
    }),
  state: z
    .string()
    .nullable()
    .refine((val) => val && val.length > 0, {
      message: addressErrorMap.stateRequired,
    }),
  country: z
    .string()
    .nullable()
    .refine((val) => val && val.length > 0, {
      message: addressErrorMap.countryRequired,
    }),

  postalCode: z
    .string()
    .min(1, { message: addressErrorMap.postalCodeRequired })
    .refine(isValidPostalCode, { message: addressErrorMap.postalCodeInvalid }),

  instructions: z.string().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
