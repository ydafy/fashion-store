import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/auth';
import { users } from '../database/inMemoryStore'; // Importa la "DB"

type RegisterData = Omit<User, 'id' | 'isEmailVerified' | 'phone'>;

/**
 * @description Busca un usuario por su email.
 * @param email - El email a buscar.
 * @returns El objeto User si se encuentra, o null si no.
 */
export const findUserByEmail = (email: string): User | null => {
  const foundUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  return foundUser || null;
};

/**
 * @description Crea un nuevo usuario en la "base de datos".
 * @param userData - Los datos del usuario a crear.
 * @returns El objeto User recién creado.
 */
export const createUser = (userData: RegisterData): User => {
  const newUser: User = {
    id: uuidv4(),
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password, // En producción, esto se hashearía aquí
    //phone: userData.phone?.trim() || undefined,
    phone: undefined,
    isEmailVerified: false
  };
  users.push(newUser);
  return newUser;
};

/**
 * @description Compara una contraseña en texto plano con la del usuario.
 * En una app real, esto usaría bcrypt.compare().
 * @param plainPassword - La contraseña enviada por el cliente.
 * @param userPassword - La contraseña (o hash) almacenada.
 * @returns true si las contraseñas coinciden.
 */
export const comparePasswords = (
  plainPassword: string,
  userPassword?: string
): boolean => {
  return plainPassword === userPassword;
};

// ✨ AÑADIMOS UN ALMACÉN TEMPORAL PARA LAS SOLICITUDES DE CAMBIO
// En un backend real, esto sería una tabla en la base de datos.
const emailChangeRequests: Record<string, { newEmail: string; token: string }> =
  {};

/**
 * @description Inicia el proceso de cambio de correo para un usuario.
 * @param userId - El ID del usuario que solicita el cambio.
 * @param newEmail - El nuevo correo electrónico deseado.
 * @returns {boolean} - true si la solicitud se procesó.
 */
export const requestEmailChange = (
  userId: string,
  newEmail: string
): boolean => {
  const user = users.find((u) => u.id === userId);
  if (!user) return false;

  const token = `email-change-token-${uuidv4()}`;
  emailChangeRequests[userId] = { newEmail, token };

  // En un backend real, aquí se enviaría el correo electrónico.
  console.log(
    `[AuthService] SIMULACIÓN: Enviando correo de confirmación a ${newEmail}`
  );
  console.log(`[AuthService] Token de confirmación: ${token}`);

  return true;
};

/**
 * @description Confirma y finaliza el cambio de correo usando un token.
 * @param userId - El ID del usuario.
 * @param token - El token de confirmación.
 * @returns {User | null} - El usuario actualizado o null si el token es inválido.
 */
export const confirmEmailChange = (
  userId: string,
  token: string
): User | null => {
  const request = emailChangeRequests[userId];
  const user = users.find((u) => u.id === userId);

  if (!user || !request || request.token !== token) {
    return null; // Token inválido o solicitud no encontrada
  }

  // Actualizamos el email del usuario
  user.email = request.newEmail;

  // Limpiamos la solicitud temporal
  delete emailChangeRequests[userId];

  return user;
};

// Almacén temporal para las solicitudes de verificación de teléfono
const phoneVerificationRequests: Record<
  string,
  { phone: string; code: string }
> = {};

/**
 * @description Inicia el proceso de verificación de teléfono para un usuario.
 * @param userId - El ID del usuario.
 * @param phoneNumber - El número nacional.
 * @param countryCode - El código del país (ej. 'MX').
 * @param callingCode - El código de llamada (ej. '52').
 * @returns {User | null} - El usuario actualizado o null.
 */
export const requestPhoneVerification = (
  userId: string,
  phoneNumber: string, // ✨ CAMBIO
  countryCode: string,
  callingCode: string // ✨ AÑADIDO
): User | null => {
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // ✨ CAMBIO: Reconstruimos el número completo para la simulación.
  const fullPhoneNumber = `+${callingCode}${phoneNumber}`;
  phoneVerificationRequests[userId] = { phone: fullPhoneNumber, code };

  user.phone = {
    number: phoneNumber,
    countryCode: countryCode,
    callingCode: callingCode
  };

  console.log(`[AuthService] SIMULACIÓN: Enviando SMS a ${fullPhoneNumber}`);
  console.log(`[AuthService] Código de verificación: ${code}`);

  return user;
};

/**
 * @description Cambia la contraseña de un usuario después de verificar la actual.
 * @param userId - El ID del usuario.
 * @param currentPassword - La contraseña actual para verificación.
 * @param newPassword - La nueva contraseña a establecer.
 * @returns Un objeto indicando el éxito o el motivo del fallo.
 */
export const changePassword = (
  userId: string,
  currentPassword: string,
  newPassword: string,
  logoutOtherDevices: boolean
): { success: boolean; messageKey: string } => {
  console.log(`--- Iniciando cambio de contraseña para userId: ${userId} ---`);

  const user = users.find((u) => u.id === userId);

  if (!user) {
    console.error('[AuthService] ERROR: Usuario no encontrado.');
    return { success: false, messageKey: 'auth.alerts.userNotFound' };
  }

  // ✨ LOGS DE DEPURACIÓN CRÍTICOS ✨
  console.log(
    `[AuthService] Contraseña actual recibida del frontend: "${currentPassword}"`
  );
  console.log(
    `[AuthService] Contraseña guardada en la "DB" para este usuario: "${user.password}"`
  );

  const passwordsMatch = comparePasswords(currentPassword, user.password);
  console.log(`[AuthService] ¿Las contraseñas coinciden?: ${passwordsMatch}`);

  if (!passwordsMatch) {
    console.warn(
      '[AuthService] ADVERTENCIA: La contraseña actual no coincide. Devolviendo error.'
    );
    return { success: false, messageKey: 'auth.alerts.invalidCurrentPassword' };
  }

  user.password = newPassword;
  console.log(
    `[AuthService] ÉXITO: Contraseña actualizada para el usuario: ${user.email}`
  );
  if (logoutOtherDevices) {
    // En un backend real, aquí ejecutarías una query para invalidar todos los
    // refresh tokens asociados con este userId, excepto el actual.
    // Por ejemplo: DELETE FROM refresh_tokens WHERE user_id = ? AND token != ?
    console.log(
      `[AuthService] SIMULACIÓN: Invalidando todos los demás tokens de sesión para el usuario ${userId}.`
    );
  } else {
    console.log(`[AuthService] SIMULACIÓN: NO checo la casilla ${userId}.`);
  }
  console.log(`[AuthService] SIMULACIÓN: Enviando email de notificación.`);

  return { success: true, messageKey: 'auth.alerts.passwordChangedSuccess' };
};
