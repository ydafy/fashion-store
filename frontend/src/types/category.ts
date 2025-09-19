// ✨ Importamos el tipo de traducción
import { TranslationObject } from './product'; // O './common' si lo pusiste ahí

/**
 * @description Representa una subcategoría.
 */
export interface Subcategory {
  id: string;
  name: TranslationObject; // ✨ Ahora usa el tipo de objeto de traducción
}

/**
 * @description Representa una categoría principal.
 */
export interface Category {
  id: string;
  name: TranslationObject; // ✨ Ahora usa el tipo de objeto de traducción
  iconName: string;
  subcategories: Subcategory[];
}
export { TranslationObject };
