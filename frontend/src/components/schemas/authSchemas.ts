import { z } from 'zod';
// ✨ 1. Importamos nuestra utilidad de fortaleza de contraseña
import { checkPasswordStrength } from '../../utils/passwordStrength';
// --- Claves de error para i18n ---
// Centralizar las claves aquí hace que el schema sea más legible.
const errorKeys = {
  nameRequired: 'errors:nameRequired',
  emailRequired: 'errors:emailRequired',
  emailInvalid: 'errors:emailInvalid',
  passwordRequired: 'errors:passwordRequired',
  passwordTooShort: 'errors:passwordTooShort',
  passwordWeak: 'passwordStrength:weak',
  confirmPasswordRequired: 'errors:confirmPasswordRequired',
  passwordsDoNotMatch: 'errors:passwordsDoNotMatch',
  termsRequired: 'errors:termsRequired',
  emailForPasswordResetRequired: 'errors:emailForPasswordResetRequired',
};
// --- Esquema de Registro (Refactorizado) ---
export const registerSchema = z
  .object({
    name: z.string().min(1, { message: errorKeys.nameRequired }),
    email: z
      .string()
      .min(1, { message: errorKeys.emailRequired })
      .email({ message: errorKeys.emailInvalid }),

    // ✨ 2. ELIMINADO: El campo 'phone' ya no forma parte del registro.
    // phone: z.string().min(1, { message: 'errors.phoneRequired' }),

    password: z
      .string()
      .min(8, { message: errorKeys.passwordTooShort })
      // ✨ 3. REFACTOR: Usamos nuestra función centralizada en lugar de múltiples regex.
      // La contraseña debe tener un nivel de fortaleza de al menos 2 ("media").
      .refine((pass) => checkPasswordStrength(pass).level >= 2, {
        message: errorKeys.passwordWeak,
      }),

    confirmPassword: z
      .string()
      .min(1, { message: errorKeys.confirmPasswordRequired }),

    agreeToTerms: z.boolean().refine((value) => value === true, {
      message: errorKeys.termsRequired,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorKeys.passwordsDoNotMatch,
    path: ['confirmPassword'],
  });
// --- Esquema de Login (Sin cambios, pero con claves centralizadas) ---
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: errorKeys.emailRequired })
    .email({ message: errorKeys.emailInvalid }),
  password: z.string().min(1, { message: errorKeys.passwordRequired }),
});
// --- Esquema de Olvidé Contraseña (Sin cambios, pero con claves centralizadas) ---
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: errorKeys.emailForPasswordResetRequired })
    .email({ message: errorKeys.emailInvalid }),
});
// --- Tipos Inferidos ---
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
