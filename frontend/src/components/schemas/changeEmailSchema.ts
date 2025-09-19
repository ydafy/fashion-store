import { z } from 'zod';
import { changeEmailErrorMap } from './changeEmailErrorMap';

export const createChangeEmailSchema = (currentEmail: string) =>
  z
    .object({
      newEmail: z
        .string()
        .min(1, { message: changeEmailErrorMap.emailRequired })
        .email({ message: changeEmailErrorMap.emailInvalid })
        .refine((email) => email.toLowerCase() !== currentEmail.toLowerCase(), {
          message: changeEmailErrorMap.emailIsSameAsCurrent,
        }),
      confirmEmail: z
        .string()
        .min(1, { message: changeEmailErrorMap.confirmEmailRequired }),
    })
    .refine((data) => data.newEmail === data.confirmEmail, {
      message: changeEmailErrorMap.emailsDoNotMatch,
      path: ['confirmEmail'], // El error se mostrará en el campo de confirmación
    });

export type ChangeEmailFormData = z.infer<
  ReturnType<typeof createChangeEmailSchema>
>;
