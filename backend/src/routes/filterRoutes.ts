import { Router } from 'express';
import {
  getAvailableFilters,
  getFeaturedFiltersController
} from '../controllers/filterController';

const router = Router();
router.get('/', getAvailableFilters);
router.get('/featured', getFeaturedFiltersController);
export default router;
