import { PaymentFormData } from '../../components/schemas/paymentSchema';
//import { detectCardBrand } from '../../utils/cardUtils';

// We no longer send 'brand' and 'last4'.
// We send the full card number for the backend to process.
export interface TokenizedPaymentData {
  token: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  nickname?: string;
}

/**
 * @description Simulates tokenization. No longer detects the brand.
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
        cardNumber: sanitizedCardNumber, // We passed the full number
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
 * @description Simulates processing a payment through a third-party provider.
 * Takes 2-3 seconds and has a small chance of failure.
 * @param {object} paymentDetails - Contains the card token or saved card ID.
 * @returns {Promise<{success: boolean; message: string}>} An object indicating whether the payment was successful.
 */
export const processPayment = (paymentDetails: {
  amount: number;
  token?: string; // For new cards
  savedCardId?: string; // For saved cards
}): Promise<{ success: boolean; message: string }> => {
  console.log('[PaymentGateway] Procesando pago:', paymentDetails);

  return new Promise((resolve) => {
    const randomDelay = 2000 + Math.random() * 1000; // Delay between 2 and 3 seconds

    setTimeout(() => {
      // We simulate a failure rate of 10%
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
