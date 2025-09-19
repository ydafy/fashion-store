import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

const MOCK_USER_ID = 'testuser001';

// Esta función sigue siendo síncrona porque getMethodsByUserId no escribe en el disco.
export const getPaymentMethods = (req: Request, res: Response) => {
  try {
    const methods = paymentService.getMethodsByUserId(MOCK_USER_ID);
    res.status(200).json(methods);
    return;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ message: 'Error fetching payment methods' });
    return;
  }
};

// ✨ AÑADIDO: 'async'
export const addPaymentMethod = async (req: Request, res: Response) => {
  const {
    token,
    cardNumber,

    last4,
    expMonth,
    expYear,
    isDefault,
    nickname
  } = req.body;

  if (!token || !cardNumber || !expMonth || !expYear) {
    res
      .status(400)
      .json({ message: 'Missing required tokenized card details' });
    return;
  }

  try {
    // ✨ AÑADIDO: 'await'
    const newMethod = await paymentService.addMethod(MOCK_USER_ID, {
      token,
      cardNumber,
      expMonth,
      expYear,
      isDefault: isDefault || false,
      nickname
    });
    res.status(201).json(newMethod);
    return;
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ message: 'Error adding payment method' });
    return;
  }
};

// ✨ AÑADIDO: 'async'
export const setDefaultPaymentMethod = async (req: Request, res: Response) => {
  const { methodId } = req.params;
  try {
    // ✨ AÑADIDO: 'await'
    const updatedMethods = await paymentService.setDefaultMethod(
      MOCK_USER_ID,
      methodId
    );
    if (updatedMethods) {
      res.status(200).json(updatedMethods);
      return;
    } else {
      res.status(404).json({ message: 'Payment method not found' });
      return;
    }
  } catch (error) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({ message: 'Error setting default method' });
    return;
  }
};

// ✨ AÑADIDO: 'async'
export const deletePaymentMethod = async (req: Request, res: Response) => {
  console.log(
    `[Backend Controller] DELETE request received for methodId: ${req.params.methodId}`
  );
  const { methodId } = req.params;
  try {
    // ✨ AÑADIDO: 'await'
    const success = await paymentService.deleteMethodById(
      MOCK_USER_ID,
      methodId
    );
    if (success) {
      res.status(204).send();
      return;
    } else {
      res.status(404).json({ message: 'Payment method not found' });
      return;
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ message: 'Error deleting payment method' });
    return;
  }
};
