import { API_BASE_URL } from '../../config/api';
import { Address } from '../../types/address';

const API_URL = `${API_BASE_URL}/api/addresses`;

type CreateAddressData = Omit<Address, 'id' | 'isDefault'>;
type UpdateAddressData = Partial<CreateAddressData>;

export const getAddresses = async (): Promise<Address[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch addresses');
  }
  return response.json();
};

export const createAddress = async (
  addressData: CreateAddressData,
): Promise<Address> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(addressData),
  });
  if (!response.ok) {
    throw new Error('Failed to create address');
  }
  return response.json();
};

export const updateAddress = async (
  addressId: string,
  addressData: UpdateAddressData,
): Promise<Address> => {
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: 'PUT', // Usamos PUT para una actualización completa o parcial
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(addressData),
  });
  if (!response.ok) {
    throw new Error('Failed to update address');
  }
  return response.json();
};

export const deleteAddress = async (addressId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${addressId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete address');
  }
};

export const setDefaultAddress = async (
  addressId: string,
): Promise<Address[]> => {
  const response = await fetch(`${API_URL}/${addressId}/default`, {
    method: 'PATCH', // Usamos PATCH, ya que es una acción específica sobre un recurso
  });
  if (!response.ok) {
    throw new Error('Failed to set default address');
  }
  return response.json();
};
