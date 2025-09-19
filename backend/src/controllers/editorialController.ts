import { Request, Response } from 'express';
import { getEditorials } from '../services/editorial.service';
import { EditorialCard } from '../types/editorial';
export const getEditorialsController = (req: Request, res: Response): void => {
  try {
    const editorials = getEditorials();
    console.log('[EditorialController] Serving editorial cards.');
    res.status(200).json(editorials);
  } catch (error) {
    console.error('[EditorialController] Error fetching editorials:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
