import { TranslationObject } from './product'; // Reutilizamos este tipo
import { HubAction } from './promotionalHub'; // Reutilizamos la acción

export interface EditorialCard {
  id: string;
  imageUrl: string;
  title: TranslationObject;
  action: HubAction; // Usamos nuestra estructura de acción robusta
}
