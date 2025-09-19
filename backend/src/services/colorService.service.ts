import productsData from '../data/products.json';
import { Product, ProductVariant } from '../types/product';

interface FeaturedColor {
  colorCode: string;
  colorName: { es: string; en: string };
  textureImageUrl: string;
}

// Nuestra lista de colores curada
const predefinedColorCodes = [
  '#000000',
  '#FFFFFF',
  '#B22222',
  '#0f4b60',
  '#edddca',
  '#9c661d'
]; // Negro, Blanco, Rojo, Azul, Crema (Beige), Café

export const getFeaturedColors = (lang: 'es' | 'en'): FeaturedColor[] => {
  try {
    const featuredColors: FeaturedColor[] = [];

    for (const colorCode of predefinedColorCodes) {
      let foundVariant: ProductVariant | null = null;

      // Buscamos en todos los productos y todas sus variantes
      for (const product of productsData as Product[]) {
        const matchingVariant = product.variants.find(
          (variant) =>
            variant.colorCode.toLowerCase() === colorCode.toLowerCase()
        );
        if (matchingVariant) {
          foundVariant = matchingVariant;
          break; // Encontramos uno, pasamos al siguiente color
        }
      }

      if (foundVariant && foundVariant.images.length > 0) {
        // Obtenemos la última imagen (la de la textura)
        const textureImage =
          foundVariant.images[foundVariant.images.length - 1];

        featuredColors.push({
          colorCode: foundVariant.colorCode,
          colorName: foundVariant.colorName, // Devolvemos el objeto de traducción completo
          textureImageUrl: textureImage.uri // Usamos la propiedad 'uri'
        });
      } else {
        console.warn(
          `[ColorService] No se encontró un producto para el código de color: ${colorCode}`
        );
        // Opcional: podríamos añadir un placeholder si un color no se encuentra
      }
    }
    return featuredColors;
  } catch (error) {
    console.error('Error fetching featured colors:', error);
    // En un caso real, podríamos devolver un array vacío o lanzar el error
    return [];
  }
};
