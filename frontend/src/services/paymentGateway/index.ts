import { PaymentFormData } from '../../components/schemas/paymentSchema';
import { detectCardBrand } from '../../utils/cardUtils';

// ✨ EL CONTRATO HA CAMBIADO: Ya no enviamos 'brand' ni 'last4'.
// Enviamos el número de tarjeta completo para que el backend lo procese.
export interface TokenizedPaymentData {
  token: string;
  cardNumber: string; // El número completo
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  nickname?: string;
}

/**
 * @description Simula la tokenización. Ya no detecta la marca.
 */
export const createPaymentToken = (
  cardData: PaymentFormData,
): Promise<TokenizedPaymentData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sanitizedCardNumber = cardData.cardNumber.replace(/\s/g, '');
      const [expMonth, expYear] = cardData.expiryDate.split('/');

      const tokenizedData: TokenizedPaymentData = {
        token: `pm_tok_${Date.now()}`,
        cardNumber: sanitizedCardNumber, // Pasamos el número completo
        expMonth: parseInt(expMonth, 10),
        expYear: parseInt(`20${expYear}`, 10),
        isDefault: cardData.isDefault || false,
        nickname: cardData.nickname,
      };
      resolve(tokenizedData);
    }, 1500);
  });
};

/**
 * @description Simula el procesamiento de un pago a través de un proveedor externo.
 * Tarda entre 2 y 3 segundos y tiene una pequeña probabilidad de fallar.
 * @param {object} paymentDetails - Contiene el token de la tarjeta o el ID de la tarjeta guardada.
 * @returns {Promise<{success: boolean; message: string}>} Un objeto indicando si el pago fue exitoso.
 */
export const processPayment = (paymentDetails: {
  amount: number;
  token?: string; // Para tarjetas nuevas
  savedCardId?: string; // Para tarjetas guardadas
}): Promise<{ success: boolean; message: string }> => {
  console.log('[PaymentGateway] Procesando pago:', paymentDetails);

  return new Promise((resolve) => {
    const randomDelay = 2000 + Math.random() * 1000; // Delay entre 2 y 3 segundos

    setTimeout(() => {
      // Simulamos una tasa de fallo del 10%
      const isSuccessful = Math.random() > 0.1;

      if (isSuccessful) {
        console.log('[PaymentGateway] Pago APROBADO');
        resolve({ success: true, message: 'Payment successful' });
      } else {
        console.log('[PaymentGateway] Pago RECHAZADO');
        resolve({
          success: false,
          message:
            'Your card was declined. Please check your details or try another card.',
        });
      }
    }, randomDelay);
  });
};
