import { Request, Response } from 'express';
import productsData from '../data/products.json';
import { Product } from '../types/product';
import { assignDisplayBadge } from '../services/product.service';

export const getProductsByBatch = (req: Request, res: Response): void => {
  try {
    const ids = req.query.ids?.toString().split(',');
    if (!ids || ids.length === 0) {
      res.status(200).json([]);
      return;
    }

    const requestedProducts = (productsData as Product[]).filter((product) =>
      ids.includes(product.id)
    );
    const resultsWithBadges = requestedProducts.map(assignDisplayBadge);

    res.json(resultsWithBadges);
  } catch (error) {
    console.error('Error fetching products by batch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
