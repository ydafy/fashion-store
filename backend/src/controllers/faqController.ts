import { Request, Response } from 'express';
import faqData from '../data/faq.json';

/**
 * @description Obtiene los datos de las Preguntas Frecuentes (FAQ).
 */
export const getFaqData = (req: Request, res: Response): void => {
  console.log('[FaqController] GET /api/faq');
  res.status(200).json(faqData);
};
