import { Request, Response } from 'express';
import { getFeaturedColors } from '../services/colorService.service';

export const getFeaturedColorsController = (req: Request, res: Response) => {
  try {
    // Extraemos el idioma, igual que en nuestros otros controladores
    const lang = (req.headers['accept-language'] || 'es').substring(0, 2) as
      | 'es'
      | 'en';
    const supportedLangs = ['es', 'en'];
    const finalLang = supportedLangs.includes(lang) ? lang : 'es';

    // ✨ Le pasamos el idioma al servicio (aunque el servicio actual no lo usa para filtrar, es una buena práctica)
    const featuredColors = getFeaturedColors(finalLang);
    res.json(featuredColors);
  } catch (error) {
    console.error('Error in getFeaturedColorsController:', error);
    res.status(500).json({ error: 'Failed to fetch featured colors' });
  }
};
