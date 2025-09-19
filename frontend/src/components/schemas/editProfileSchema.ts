import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(2, { message: 'errors:nameTooShort' }),
  birthDate: z.string().optional(), // La validación de fecha puede ser más compleja, pero esto es suficiente
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  // La URL del avatar no es parte del formulario, se maneja por separado
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
