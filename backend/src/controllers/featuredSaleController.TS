import { Request, Response } from 'express';
import { getFeaturedSaleProducts } from '../services/featuredSale.service';

export const getFeaturedSaleController = (
  req: Request,
  res: Response
): void => {
  try {
    const featuredProducts = getFeaturedSaleProducts();
    console.log('[FeaturedSaleController] Serving 3 featured sale products.');
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error(
      '[FeaturedSaleController] Error fetching featured sale products:',
      error
    );
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
