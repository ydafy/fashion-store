import { Router } from 'express';
import {
  getAllSections,
  getHierarchicalLocations,
  getPickupLocations
} from '../controllers/contentController';

const router = Router();

// Define las rutas para el contenido estático

router.get('/sections', getAllSections);
router.get('/locations', getHierarchicalLocations);
router.get('/pickup-locations', getPickupLocations);

export default router;
