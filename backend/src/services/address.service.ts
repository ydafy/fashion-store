import { v4 as uuidv4 } from 'uuid';
import { Address } from '../types/address';
import { addressesData } from '../database/inMemoryStore';
import { promises as fs } from 'fs';
import path from 'path';

// ✨ 1. AÑADIMOS LA LÓGICA DE PERSISTENCIA
const dataPath = path.resolve(process.cwd(), 'src', 'data', 'addresses.json');

const saveAddresses = async () => {
  try {
    // Tomamos la data de inMemoryStore y la guardamos en el archivo
    await fs.writeFile(dataPath, JSON.stringify(addressesData, null, 2));
  } catch (error) {
    console.error('Error: Failed to save addresses to disk:', error);
  }
};

type CreateAddressData = Omit<Address, 'id' | 'isDefault'>;
type UpdateAddressData = Partial<CreateAddressData>;

export const findAllAddresses = (): Address[] => {
  return addressesData;
};

export const findAddressById = (id: string): Address | undefined => {
  return addressesData.find((addr) => addr.id === id);
};

export const createAddress = async (
  data: CreateAddressData
): Promise<Address> => {
  const newAddress: Address = {
    id: uuidv4(),
    ...data,
    isDefault: addressesData.length === 0
  };
  addressesData.push(newAddress);
  await saveAddresses(); // ✨ Guardamos
  return newAddress;
};

export const updateAddress = async (
  id: string,
  data: UpdateAddressData
): Promise<Address | null> => {
  const addressIndex = addressesData.findIndex((addr) => addr.id === id);
  if (addressIndex === -1) return null;

  const updatedAddress = { ...addressesData[addressIndex], ...data };
  addressesData[addressIndex] = updatedAddress;
  await saveAddresses(); // ✨ Guardamos
  return updatedAddress;
};

export const deleteAddress = async (id: string): Promise<boolean> => {
  const initialLength = addressesData.length;
  const wasDefault = addressesData.find((a) => a.id === id)?.isDefault;

  const updatedData = addressesData.filter((addr) => addr.id !== id);

  if (updatedData.length < initialLength) {
    if (wasDefault && updatedData.length > 0) {
      const hasDefault = updatedData.some((a) => a.isDefault);
      if (!hasDefault) updatedData[0].isDefault = true;
    }
    addressesData.length = 0; // Limpiamos el array original
    addressesData.push(...updatedData); // Lo llenamos con los nuevos datos
    await saveAddresses(); // ✨ Guardamos
    return true;
  }
  return false;
};

export const setDefaultAddress = async (
  id: string
): Promise<Address[] | null> => {
  if (!addressesData.some((addr) => addr.id === id)) return null;

  const updatedAddresses = addressesData.map((address) => ({
    ...address,
    isDefault: address.id === id
  }));

  addressesData.length = 0;
  addressesData.push(...updatedAddresses);
  await saveAddresses(); // ✨ Guardamos
  return addressesData;
};
