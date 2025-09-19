import { API_BASE_URL } from '../../config/api';
import { User } from '../../types/auth';
import { ChangePasswordFormData } from '../../components/schemas/changePasswordSchema';

// --- Tipos para los Payloads y Respuestas ---
type LoginPayload = Pick<User, 'email' | 'password'>;
type RegisterPayload = Omit<User, 'id' | 'isEmailVerified'>;

interface AuthResponse {
  user: User;
  token: string;
}

// --- Función para manejar errores de la API ---
const handleAuthError = async (response: Response) => {
  const errorData = {
    message: 'An unknown error occurred.',
    messageKey: 'common:genericError',
  };
  try {
    const data = await response.json();
    if (data && data.messageKey) {
      errorData.messageKey = data.messageKey;
      errorData.message = data.message || data.messageKey;
    }
  } catch (jsonError) {
    console.warn(
      '[handleAuthError] Could not parse JSON from error response:',
      jsonError,
    );
  }
  const error = new Error(errorData.message);
  (error as any).messageKey = errorData.messageKey;
  return error;
};

// --- Funciones del Servicio ---

/**
 * @description Realiza una solicitud de login al backend.
 * @param credentials - Email y contraseña del usuario.
 * @returns Una promesa que se resuelve con el usuario y el token.
 */
export const login = async (
  credentials: LoginPayload,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw await handleAuthError(response);
  }
  return response.json();
};

/**
 * @description Realiza una solicitud de registro al backend.
 * @param userData - Datos del nuevo usuario.
 * @returns Una promesa que se resuelve con el nuevo usuario y el token.
 */
export const register = async (
  userData: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw await handleAuthError(response);
  }
  return response.json();
};

/**
 * @description Realiza una solicitud para reenviar el email de verificación.
 * @param email - El email del usuario.
 * @returns Una promesa que se resuelve si la solicitud fue exitosa.
 */
export const resendVerificationEmail = async (email: string): Promise<void> => {
  // En una app real, este sería un endpoint del backend.
  // Por ahora, simulamos una operación exitosa.
  console.log(
    `[AuthService] Simulating resend verification email to: ${email}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula demora de red
  // No devuelve nada en caso de éxito, pero lanzaría un error si fallara.
};

/**
 * @description Realiza una solicitud para el reseteo de contraseña.
 * @param email - El email del usuario.
 * @returns Una promesa que se resuelve si la solicitud fue exitosa.
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/request-password-reset`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) {
    throw await handleAuthError(response);
  }
  // El backend devuelve un mensaje de éxito, pero la función no necesita devolverlo.
};

/**
 * @description Solicita un cambio de correo electrónico al backend.
 * @param userId - El ID del usuario actual.
 * @param newEmail - La nueva dirección de correo deseada.
 */
export const requestEmailChange = async (
  userId: string,
  newEmail: string,
): Promise<void> => {
  // CORRECCIÓN: Añadimos el prefijo /api/auth/ a la URL
  const response = await fetch(
    `${API_BASE_URL}/api/auth/request-email-change`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newEmail }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.messageKey || 'Failed to request email change');
  }
  // No esperamos un cuerpo en la respuesta de éxito
};

/**
 * @description Solicita la verificación de un número de teléfono al backend.
 * @param userId - El ID del usuario actual.
 * @param phone - El nuevo número de teléfono en formato internacional.
 * @param countryCode - El código del país del número.
 */

interface PhoneVerificationResponse {
  // ✨ AÑADIDO
  user: User;
}

interface PhoneVerificationPayload {
  phoneNumber: string;
  countryCode: string;
  callingCode: string;
}
export const requestPhoneVerification = async (
  userId: string,
  payload: PhoneVerificationPayload, // ✨ 2. Recibimos el payload como un objeto
): Promise<User> => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/request-phone-verification`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ✨ 3. CONSTRUIMOS EL BODY CORRECTO
      //    Las claves aquí deben coincidir EXACTAMENTE con las del backend.
      body: JSON.stringify({
        userId,
        phoneNumber: payload.phoneNumber,
        countryCode: payload.countryCode,
        callingCode: payload.callingCode,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.messageKey || 'Failed to request phone verification',
    );
  }

  const data: { user: User } = await response.json();
  return data.user;
};

/**
 * @description Realiza una solicitud para cambiar la contraseña del usuario.
 * @param userId - El ID del usuario actual.
 * @param payload - Contiene la contraseña actual y la nueva.
 * @returns Una promesa que se resuelve si el cambio fue exitoso.
 */

type ChangePasswordPayload = Omit<ChangePasswordFormData, 'confirmPassword'>;
export const changePassword = async (
  userId: string,
  payload: ChangePasswordPayload,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      logoutOtherDevices: payload.logoutOtherDevices,
    }),
  });

  if (!response.ok) {
    // Reutilizamos nuestro manejador de errores de autenticación
    throw await handleAuthError(response);
  }
  // No esperamos un cuerpo en la respuesta de éxito
};
