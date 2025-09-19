import { Request, Response } from 'express';
import * as addressService from '../services/address.service';

// --- Controlador para OBTENER TODAS las direcciones ---
export const getAllAddresses = (req: Request, res: Response): void => {
  console.log('[AddressController] GET /api/addresses');
  const addresses = addressService.findAllAddresses();
  res.json(addresses);
};

// --- Controlador para AÑADIR una nueva dirección ---
export const addAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newAddressData = req.body;
    if (
      !newAddressData?.label?.trim() ||
      !newAddressData.recipientName?.trim()
    ) {
      res.status(400).json({ message: 'Faltan datos requeridos.' });
      return;
    }
    const newAddress = await addressService.createAddress(newAddressData);
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: 'Error interno al añadir dirección.' });
  }
};

// ✨ AHORA ES ASÍNCRONO
export const updateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { addressId } = req.params;
  const updatedAddressData = req.body;
  const updatedAddress = await addressService.updateAddress(
    addressId,
    updatedAddressData
  );
  if (!updatedAddress) {
    res
      .status(404)
      .json({ message: 'Dirección no encontrada para actualizar.' });
    return;
  }
  res.status(200).json(updatedAddress);
};

// ✨ AHORA ES ASÍNCRONO
export const deleteAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { addressId } = req.params;
  const success = await addressService.deleteAddress(addressId);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Dirección no encontrada' });
  }
};

// ✨ AHORA ES ASÍNCRONO
export const setDefaultAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { addressId } = req.params;
  const updatedAddresses = await addressService.setDefaultAddress(addressId);
  if (!updatedAddresses) {
    res.status(404).json({ message: 'Dirección no encontrada.' });
    return;
  }
  res.status(200).json(updatedAddresses);
};
