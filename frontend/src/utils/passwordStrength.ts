import { COLORS } from '../constants/colors'; // Ajusta la ruta

export interface PasswordStrengthResult {
  level: 0 | 1 | 2 | 3 | 4; // 0: muy débil, 1: débil, 2: media, 3: fuerte, 4: muy fuerte
  textKey: string; // Clave i18n para el mensaje
  color: string; // Color para el indicador
}

const MIN_LENGTH_FOR_INDICATOR = 6; // Longitud mínima para empezar a evaluar más allá de "muy débil"

export const checkPasswordStrength = (
  password: string
): PasswordStrengthResult => {
  let score = 0;
  const length = password.length;

  if (length === 0) {
    return { level: 0, textKey: '', color: 'transparent' }; // Sin texto ni color si está vacío
  }
  if (length < MIN_LENGTH_FOR_INDICATOR) {
    return {
      level: 0,
      textKey: 'passwordStrength:tooShort',
      color: COLORS.error
    };
  }

  // Criterios para aumentar el score
  if (length >= 8) score++;
  if (length >= 10) score++; // Puntuación extra por longitud mayor
  if (/[A-Z]/.test(password)) score++; // Mayúsculas
  if (/[a-z]/.test(password)) score++; // Minúsculas (esto casi siempre será true si length > 0)
  if (/[0-9]/.test(password)) score++; // Números
  if (/[^A-Za-z0-9]/.test(password)) score++; // Símbolos

  // Determinar nivel, texto y color basado en el score
  // Puedes ajustar estos umbrales y mensajes
  if (score <= 2) {
    // Ejemplo: 0, 1, 2
    return { level: 1, textKey: 'passwordStrength:weak', color: COLORS.error };
  } else if (score <= 3) {
    // Ejemplo: 3
    return {
      level: 2,
      textKey: 'passwordStrength:medium',
      color: COLORS.orderCancelled
    }; // Necesitarás COLORS.warning
  } else if (score <= 4) {
    // Ejemplo: 4
    return {
      level: 3,
      textKey: 'passwordStrength:strong',
      color: COLORS.orderDelivered
    };
  } else {
    // Ejemplo: 5+
    return {
      level: 4,
      textKey: 'passwordStrength:veryStrong',
      color: COLORS.successDark
    };
  }
};
