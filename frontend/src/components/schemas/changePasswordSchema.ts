import { z } from 'zod';
import { checkPasswordStrength } from '../../utils/passwordStrength';

const errorKeys = {
  passwordTooShort: 'errors:passwordTooShort',
  passwordsDoNotMatch: 'errors:passwordsDoNotMatch',
  passwordSameAsCurrent: 'errors:passwordSameAsCurrent',
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'), // Mensaje genérico, no se mostrará
    newPassword: z
      .string()
      .min(8, { message: errorKeys.passwordTooShort })
      // Validamos que la contraseña sea al menos "media" (nivel 2)
      .refine((pass) => checkPasswordStrength(pass).level >= 2, {
        message: 'passwordStrength:weak', // Reutilizamos una clave existente
      }),
    confirmPassword: z.string().min(1, 'Required'),
    logoutOtherDevices: z.boolean().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: errorKeys.passwordsDoNotMatch,
    path: ['confirmPassword'], // El error se muestra en el campo de confirmación
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: errorKeys.passwordSameAsCurrent,
    path: ['newPassword'], // El error se muestra en el campo de nueva contraseña
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
