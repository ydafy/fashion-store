import { User } from '../types/auth';
import { users } from '../database/inMemoryStore';

// Un tipo para los datos que se pueden actualizar
type UserProfileUpdatePayload = Partial<
  Pick<User, 'name' | 'birthDate' | 'gender' | 'avatarUrl'>
>;

/**
 * @description Actualiza el perfil de un usuario en la "base de datos".
 * @param userId - El ID del usuario a actualizar.
 * @param data - Los nuevos datos del perfil.
 * @returns El objeto User actualizado o null si no se encontró.
 */
export const updateUserProfile = (
  userId: string,
  data: UserProfileUpdatePayload
): User | null => {
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return null; // Usuario no encontrado
  }

  // Actualizamos el objeto de usuario existente con los nuevos datos
  const updatedUser = {
    ...users[userIndex],
    ...data
  };

  users[userIndex] = updatedUser;

  console.log(
    `[UserService] Perfil actualizado para el usuario: ${updatedUser.email}`
  );

  return updatedUser;
};
