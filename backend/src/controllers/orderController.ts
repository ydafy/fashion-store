import { Request, Response } from 'express';
import * as orderService from '../services/order.service'; // ✨ Importamos el servicio

// --- Controlador para OBTENER TODOS los pedidos ---
export const getAllOrders = (req: Request, res: Response): void => {
  console.log('[OrderController] GET /api/orders');
  // ✨ El controlador delega la lógica al servicio ✨
  const orders = orderService.findAllOrders();
  res.status(200).json(orders);
};

// --- Controlador para OBTENER UN pedido por ID ---
export const getOrderById = (req: Request, res: Response): void => {
  const { orderId } = req.params;
  console.log(`[OrderController] GET /api/orders/${orderId}`);

  // ✨ El controlador delega la lógica al servicio ✨
  const order = orderService.findOrderById(orderId);

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'Pedido no encontrado' });
  }
};

// --- Controlador para CREAR un nuevo pedido ---
export const createOrder = (req: Request, res: Response): void => {
  try {
    const orderDataFromClient = req.body;
    console.log(
      '[OrderController] POST /api/orders - Recibido:',
      orderDataFromClient
    );

    // Validación de entrada
    if (
      !orderDataFromClient?.items?.length ||
      !orderDataFromClient.shippingMethod ||
      !orderDataFromClient.userId
    ) {
      res
        .status(400)
        .json({ message: 'Datos del pedido incompletos o inválidos.' });
      return;
    }

    // ✨ El controlador delega la creación al servicio ✨
    const newOrder = orderService.createOrder(orderDataFromClient);

    console.log(
      `[OrderController] Nuevo pedido creado por servicio: ${newOrder.id}`
    );
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('[OrderController] POST error:', error);
    res.status(500).json({ message: 'Error interno al crear el pedido.' });
  }
};
