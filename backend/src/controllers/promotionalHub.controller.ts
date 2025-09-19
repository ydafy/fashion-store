import { Request, Response } from 'express';
import hubData from '../data/promotionalHubs.json';

export const getPromotionalHubs = (req: Request, res: Response): void => {
  res.status(200).json(hubData);
};
