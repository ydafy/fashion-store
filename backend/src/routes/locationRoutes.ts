import { Router } from 'express';
import {
  getPickupLocations,
  getHierarchicalLocations
} from '../controllers/locationController';

const router = Router();
router.get('/pickup', getPickupLocations);

//RUTA PARA LOS DATOS DE LOS PICKERS
router.get('/hierarchical', getHierarchicalLocations);
export default router;
