import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import * as heroCarouselService from '../services/heroCarousel.service';

export const getHeroCarouselProducts = (req: Request, res: Response): void => {
  try {
    // ✨ 2. LLAMAMOS A LA FUNCIÓN DEDICADA
    const products = heroCarouselService.getHeroCarouselProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('[HeroCarouselController] Error:', error);
    res.status(500).json({ message: 'Error fetching hero carousel products.' });
  }
};
