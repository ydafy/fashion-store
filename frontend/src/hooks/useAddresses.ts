import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as addressService from '../services/address';
import { Address } from '../types/address';

// La "llave" única para la lista de direcciones en todo el cache de TanStack Query
const addressesQueryKey = ['addresses'];

/**
 * Hook para obtener la lista de direcciones del usuario.
 */
export const useAddresses = () => {
  return useQuery({
    queryKey: addressesQueryKey,
    queryFn: addressService.getAddresses,
  });
};

/**
 * Hook para obtener una mutación que añade una nueva dirección.
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAddress: Omit<Address, 'id' | 'isDefault'>) =>
      addressService.createAddress(newAddress),
    onSuccess: () => {
      // Invalida la query de la lista para forzar un re-fetch y actualizar la UI.
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });
};

/**
 * Hook para obtener una mutación que actualiza una dirección existente.
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      addressId: string;
      data: Partial<Omit<Address, 'id' | 'isDefault'>>;
    }) => addressService.updateAddress(variables.addressId, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });
};

/**
 * Hook para obtener una mutación que elimina una dirección.
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => addressService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });
};

/**
 * Hook para obtener una mutación que establece una dirección como predeterminada.
 */
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) =>
      addressService.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressesQueryKey });
    },
  });
};
