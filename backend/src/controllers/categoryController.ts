import { Request, Response } from 'express';
import categoriesData from '../data/categories.json';

/**
 * @description Obtiene la lista completa de categorías con sus traducciones.
 */
export const getAllCategories = (req: Request, res: Response): void => {
  console.log('[CategoryController] GET /api/categories');

  // ✨ Simplemente enviamos los datos crudos del JSON.
  // El frontend se encargará de la traducción.
  res.status(200).json(categoriesData);
};
