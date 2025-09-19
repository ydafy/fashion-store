import { Request, Response } from 'express';

// Importamos los datos JSON directamente
import productsData from '../data/products.json';
import sectionCardData from '../data/sectionCardData.json';
import locationsData from '../data/locations.json';
import pickupLocationsData from '../data/pickup_locations.json';

// --- Controlador para OBTENER las secciones ---
export const getAllSections = (req: Request, res: Response): void => {
  console.log('[ContentController] GET /api/sections');
  res.json(sectionCardData);
};

// --- Controlador para OBTENER la estructura de locaciones ---
export const getHierarchicalLocations = (req: Request, res: Response): void => {
  console.log('[ContentController] GET /api/locations');
  res.json(locationsData);
};

// --- Controlador para OBTENER los puntos de recogida ---
export const getPickupLocations = (req: Request, res: Response): void => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    sortBy,
    order = 'asc',
    onSale
  } = req.query;
  console.log('[ContentController] GET /api/pickup-locations');
  res.status(200).json(pickupLocationsData);
};
