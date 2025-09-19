import { TranslationObject } from './product'; // Reutilizamos nuestro tipo de traducción

export interface FeaturedColor {
  colorCode: string;
  colorName: TranslationObject;
  textureImageUrl: string;
}
