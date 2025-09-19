import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentService from '../services/payment';
import { TokenizedPaymentData } from '../services/paymentGateway';
//import { PaymentMethod } from '../types/payment';

const paymentMethodsQueryKey = ['paymentMethods'];

/**
 * Hook para obtener la lista de métodos de pago del usuario.
 */
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: paymentMethodsQueryKey,
    queryFn: paymentService.getPaymentMethods,
  });
};

/**
 * Hook para obtener una mutación que añade un nuevo método de pago (tokenizado).
 */
export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✨ LA CORRECCIÓN CLAVE: Definimos el tipo exacto que el servicio addMethod espera ahora.
    // Es el mismo tipo que devuelve nuestro 'createPaymentToken' en el frontend.
    mutationFn: (tokenizedMethod: TokenizedPaymentData) =>
      paymentService.addPaymentMethod(tokenizedMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
};

/**
 * Hook para obtener una mutación que elimina un método de pago.
 */
export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // ✨ LA CORRECCIÓN CLAVE ✨
    // Acepta un 'methodId' de tipo 'string'
    mutationFn: (methodId: string) =>
      // Llama a la función de servicio correcta: deletePaymentMethod
      paymentService.deletePaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
};

/**
 * Hook para obtener una mutación que establece un método como predeterminado.
 */
export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (methodId: string) =>
      paymentService.setDefaultPaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsQueryKey });
    },
  });
};
