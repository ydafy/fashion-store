import { Request, Response } from 'express';
import * as locationService from '../services/location.service';

/**
 * @description Maneja la petición para obtener las ubicaciones de recogida.
 * Lee los query params 'city' y 'country' y los pasa al servicio.
 */
export const getPickupLocations = (req: Request, res: Response): void => {
  // Obtenemos los parámetros de la query. Serán 'undefined' si no se envían.
  const city = req.query.city as string | undefined;
  const country = req.query.country as string | undefined;
  const locations = locationService.getPickupLocations(city, country);

  res.status(200).json(locations);
};

export const getHierarchicalLocations = (req: Request, res: Response): void => {
  const locations = locationService.getHierarchicalLocations();
  res.status(200).json(locations);
};
