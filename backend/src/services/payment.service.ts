import { userPaymentMethods } from '../database/inMemoryStore';
import { PaymentMethod } from '../types/payment';
import { promises as fs } from 'fs';
import path from 'path';
import { detectCardBrand } from '../utils/cardUtils';

// Usamos una ruta absoluta para asegurar que siempre escribamos en 'src/data'
const dataPath = path.resolve(
  process.cwd(),
  'src',
  'data',
  'paymentMethods.json'
);

/**
 * Guarda el estado actual del almacén de pagos en el archivo .json.
 */
const savePaymentMethods = async () => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(userPaymentMethods, null, 2));
  } catch (error) {
    console.error('Error: Failed to save payment methods to disk:', error);
  }
};

// --- Funciones del Servicio ---

/**
 * Obtiene los métodos de pago (solo lee de la memoria, por eso es síncrona).
 */
export const getMethodsByUserId = (userId: string): PaymentMethod[] => {
  return userPaymentMethods[userId] || [];
};

/**
 * Establece una tarjeta como predeterminada y guarda el cambio.
 */
export const setDefaultMethod = async (
  userId: string,
  methodId: string
): Promise<PaymentMethod[] | null> => {
  if (
    !userPaymentMethods[userId] ||
    !userPaymentMethods[userId].some((m) => m.id === methodId)
  ) {
    return null;
  }
  userPaymentMethods[userId] = userPaymentMethods[userId].map((method) => ({
    ...method,
    isDefault: method.id === methodId
  }));

  await savePaymentMethods(); // Guardamos el cambio en el archivo .json
  return userPaymentMethods[userId];
};

/**
 * Añade un nuevo método de pago, detecta la marca y guarda el cambio.
 */
export const addMethod = async (
  userId: string,
  methodData: {
    token: string;
    cardNumber: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
    nickname?: string;
  }
): Promise<PaymentMethod> => {
  if (!userPaymentMethods[userId]) {
    userPaymentMethods[userId] = [];
  }

  if (methodData.isDefault) {
    userPaymentMethods[userId].forEach((method) => (method.isDefault = false));
  }

  const brand = detectCardBrand(methodData.cardNumber);
  const last4 = methodData.cardNumber.slice(-4);

  const newMethod: PaymentMethod = {
    id: `pm_${Date.now()}`,
    token: methodData.token,
    brand: brand,
    last4: last4,
    expMonth: methodData.expMonth,
    expYear: methodData.expYear,
    isDefault: methodData.isDefault,
    nickname: methodData.nickname
  };

  userPaymentMethods[userId].push(newMethod);
  const hasDefault = userPaymentMethods[userId].some((m) => m.isDefault);
  if (!hasDefault) {
    userPaymentMethods[userId][0].isDefault = true;
  }

  await savePaymentMethods(); // Guardamos el cambio en el archivo .json
  return newMethod;
};

/**
 * Elimina un método de pago por su ID y guarda el cambio.
 */
export const deleteMethodById = async (
  userId: string,
  methodId: string
): Promise<boolean> => {
  if (!userPaymentMethods[userId]) {
    return false;
  }
  const initialLength = userPaymentMethods[userId].length;
  const methodToDelete = userPaymentMethods[userId].find(
    (m) => m.id === methodId
  );
  if (!methodToDelete) return false;
  userPaymentMethods[userId] = userPaymentMethods[userId].filter(
    (method) => method.id !== methodId
  );
  const success = userPaymentMethods[userId].length < initialLength;

  if (success) {
    // ✨ REGLA DE NEGOCIO #2: Si la tarjeta eliminada era la predeterminada,
    // y todavía quedan tarjetas, hacemos que la primera sea la nueva predeterminada.
    const wasDefault = methodToDelete.isDefault;
    if (wasDefault && userPaymentMethods[userId].length > 0) {
      userPaymentMethods[userId][0].isDefault = true;
    }

    await savePaymentMethods();
  }
  return success;
};
