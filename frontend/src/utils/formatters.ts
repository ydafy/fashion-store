import i18n from '../config/i18n'; // Asegúrate de que la ruta a tu config de i18n sea correcta
import { DEFAULT_CURRENCY_CODE } from '../constants/appConfig'; // Asegúrate de que la ruta a tus constantes sea correcta

/**
 * Formatea un número como una cadena de moneda.
 * Usa el idioma actual de la app y la moneda por defecto si no se especifican.
 * @param amount El monto numérico a formatear.
 * @param locale El código de locale (ej. "en", "es"). Por defecto, usa el idioma de i18n.
 * @param currencyCode El código de moneda ISO 4217 (ej. "USD", "MXN"). Por defecto, usa la constante global.
 * @returns Una cadena formateada representando la moneda.
 */
export const formatCurrency = (
  amount: number,
  locale: string = i18n.language,
  currencyCode: string = DEFAULT_CURRENCY_CODE
): string => {
  try {
    if (typeof amount !== 'number' || isNaN(amount)) {
      console.warn(
        `[formatCurrency] 'amount' no es un número válido: ${amount}. Usando 0.`
      );
      amount = 0;
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  } catch (e) {
    console.warn(
      `[formatCurrency] Error formateando moneda para locale '${locale}', currency '${currencyCode}', amount '${amount}'. Usando fallback simple. Error:`,
      e
    );
    const symbols: { [key: string]: string } = {
      USD: '$',
      MXN: '$',
      EUR: '€'
    };
    const symbol = symbols[currencyCode.toUpperCase()] || currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

/**
 * Formatea una fecha (string o Date object) a un string legible.
 * Usa el idioma actual de la app si no se especifica.
 * @param date La fecha a formatear (string ISO o objeto Date).
 * @param locale El código de locale (ej. "en", "es"). Por defecto, usa el idioma de i18n.
 * @param options Opciones de formato para Intl.DateTimeFormat.
 * @returns Un string de fecha formateada.
 */
export const formatDisplayDate = (
  date: string | Date,
  locale: string = i18n.language, // ✨ VALOR POR DEFECTO
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObject.getTime())) {
      console.warn(
        `[formatDisplayDate] Fecha inválida proporcionada: ${date}.`
      );
      return typeof date === 'string' ? date : 'Invalid Date';
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObject);
  } catch (e) {
    console.warn(
      `[formatDisplayDate] Error formateando fecha para locale '${locale}'. Error:`,
      e
    );
    return typeof date === 'string' ? date : 'Date Error';
  }
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', {
    // O tu locale preferido
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
