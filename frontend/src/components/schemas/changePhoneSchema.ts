import { z } from 'zod';
import { changePhoneErrorMap } from './changePhoneErrorMap';
import { PhoneData } from '../../types/auth';

const phoneInput = z.object({
  number: z.string(),
  countryCode: z.string(),
  callingCode: z.string(),
  isValid: z.boolean(),
});

export const createChangePhoneSchema = (currentUserPhone?: PhoneData) =>
  z
    .object({
      phone: phoneInput.refine((data) => data.isValid, {
        message: changePhoneErrorMap.phoneInvalid,
      }),
      consent: z.boolean().refine((val) => val === true, {
        message: changePhoneErrorMap.consentRequired,
      }),
    })
    // ✨ SOLUCIÓN: Reemplazamos el .refine() global por .superRefine()
    .superRefine((data, ctx) => {
      // Si no hay un número de usuario actual, no hacemos nada.
      if (!currentUserPhone) {
        return;
      }

      // Comparamos el número y el código de país.
      const isSameNumber = data.phone.number === currentUserPhone.number;
      const isSameCountry =
        data.phone.countryCode === currentUserPhone.countryCode;

      // Si ambos son iguales, añadimos el error explícitamente.
      if (isSameNumber && isSameCountry) {
        ctx.addIssue({
          // El código de error que Zod usará.
          code: z.ZodIssueCode.custom,
          // El mensaje que se pasará a react-hook-form.
          message: changePhoneErrorMap.phoneIsSameAsCurrent,
          // La ruta exacta donde debe aparecer el error.
          path: ['phone'],
        });
      }
    });

export type ChangePhoneFormData = z.infer<
  ReturnType<typeof createChangePhoneSchema>
>;
