/**
 * Verifica si un valor de tipo string no es nulo, indefinido o vacío (después de recortar espacios).
 * @param value El valor a verificar.
 * @returns `true` si el valor contiene caracteres, `false` en caso contrario.
 */
export const isNotEmpty = (value: string | undefined | null): boolean => {
  return !!value && value.trim().length > 0;
};

/**
 * Valida un número de tarjeta de crédito usando el algoritmo de Luhn (checksum).
 * @param cardNumber El número de tarjeta como string.
 * @returns `true` si el número de tarjeta pasa la validación de Luhn.
 */
export const isValidLuhn = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\D/g, '');
  if (!/^\d+$/.test(sanitized)) {
    return false;
  }
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

/**
 * Valida la longitud y el formato de un número de tarjeta de crédito.
 * @param cardNumber El número de tarjeta como string.
 * @returns `true` si el número de tarjeta tiene una longitud válida y pasa el algoritmo de Luhn.
 */
export const isValidCardNumber = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\D/g, '');
  const length = sanitized.length;
  if (length < 13 || length > 19) {
    return false;
  }
  return isValidLuhn(sanitized);
};

/**
 * Valida una fecha de expiración (formato MM/YY) y comprueba que no sea en el pasado.
 * @param expiryDate La fecha de expiración en formato "MM/YY".
 * @returns `true` si el formato es válido y la fecha no ha expirado.
 */
export const isValidExpiryDate = (expiryDate: string): boolean => {
  // Regex para validar el formato MM/YY estrictamente.
  if (!/^(0[1-9]|1[0-2])\/?(\d{2})$/.test(expiryDate)) {
    return false;
  }

  const [monthStr, yearStr] = expiryDate.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10); // Asume que '25' es 2025

  const now = new Date();
  // Crea una fecha para el ÚLTIMO día del mes de expiración.
  // Al poner el día como 0 en el mes siguiente, obtenemos el último día del mes actual.
  const expiry = new Date(year, month, 0);

  // La tarjeta es válida si su fecha de expiración es posterior o igual a la fecha actual.
  return expiry >= now;
};

/**
 * Valida un código CVV (longitud de 3 o 4 dígitos).
 * @param cvv El código CVV como string.
 * @returns `true` si el CVV tiene una longitud válida.
 */
export const isValidCvv = (cvv: string): boolean => {
  const sanitized = cvv.replace(/\D/g, '');
  return sanitized.length >= 3 && sanitized.length <= 4;
};

/**
 * Valida un formato básico de dirección de correo electrónico.
 * @param email La dirección de correo electrónico a validar.
 * @returns `true` si el email tiene un formato válido.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Valida un número de teléfono, asegurando que contenga 10 dígitos numéricos.
 * Ignora caracteres de formato como '(', ')', '-', y espacios.
 * @param {string} phone - El número de teléfono a validar.
 * @returns {boolean} - `true` si el número es válido.
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  const sanitized = phone.replace(/\D/g, ''); // Quitamos todo lo que no sea un dígito
  return sanitized.length === 10;
};

/**
 * Valida un código postal de 5 dígitos.
 * @param {string} postalCode - El código postal a validar.
 * @returns {boolean} - `true` si el código postal es válido.
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  if (!postalCode) return false;
  // Regex simple para 5 dígitos. Se puede hacer más compleja para otros países.
  const postalCodeRegex = /^[0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
};
