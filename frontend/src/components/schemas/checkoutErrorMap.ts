export const checkoutErrorMap = {
  // Claves reutilizadas
  required: 'required', // Nueva clave genérica
  nameRequired: 'nameRequired',
  emailRequired: 'emailRequired',
  emailInvalid: 'emailInvalid',
  phoneRequired: 'phoneRequired',
  phoneInvalid: 'phoneInvalid',

  // Nuevas claves para Checkout
  cardHolderNameRequired: 'cardHolderNameRequired',
  cardNumberRequired: 'cardNumberRequired',
  cardNumberInvalid: 'cardNumberInvalid',
  cardExpiryRequired: 'cardExpiryRequired',
  cardExpiryInvalid: 'cardExpiryInvalid',
  cardCvvRequired: 'cardCvvRequired',
  cardCvvInvalid: 'cardCvvInvalid',
  savedCardRequired: 'savedCardRequired',

  // Errores de lógica de negocio
  addressRequired: 'addressRequired',
  pickupLocationRequired: 'pickupLocationRequired',
};
