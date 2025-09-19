/**
 * Traduce campos específicos de un objeto que contiene traducciones anidadas.
 * @param obj El objeto a traducir (ej. un producto o una variante).
 * @param lang El código de idioma deseado (ej. 'es', 'en').
 * @param fieldsToTranslate Un array de strings con los nombres de los campos a traducir.
 * @returns Un nuevo objeto con los campos traducidos y aplanados.
 */
const translateObject = (
  obj: any,
  lang: string,
  fieldsToTranslate: string[]
): any => {
  // Creamos una copia para no modificar el objeto original
  const translatedObj = { ...obj };

  for (const field of fieldsToTranslate) {
    // Verificamos que el campo exista en el objeto y que sea un objeto (para evitar errores)
    if (
      obj[field] &&
      typeof obj[field] === 'object' &&
      !Array.isArray(obj[field])
    ) {
      // Asignamos la traducción del idioma solicitado. Si no existe, usamos 'es' como fallback.
      translatedObj[field] = obj[field][lang] || obj[field]['es'];
    }
  }
  return translatedObj;
};

/**
 * Traduce un objeto de producto completo, incluyendo sus variantes y tags.
 * @param product El objeto de producto original con traducciones anidadas.
 * @param lang El código de idioma deseado (ej. 'es', 'en').
 * @returns Un nuevo objeto de producto completamente traducido y aplanado.
 */
export const translateProduct = (product: any, lang: string): any => {
  // Traducimos los campos de nivel superior del producto
  const translatedProduct = translateObject(product, lang, [
    'name',
    'description',
    'careInstructions'
  ]);

  // Manejo especial para el array de tags
  if (
    product.tags &&
    typeof product.tags === 'object' &&
    !Array.isArray(product.tags)
  ) {
    translatedProduct.tags = product.tags[lang] || product.tags['es'];
  }

  // Mapeamos y traducimos cada una de las variantes
  if (product.variants && Array.isArray(product.variants)) {
    translatedProduct.variants = product.variants.map((variant: any) =>
      translateObject(variant, lang, ['colorName'])
    );
  }

  return translatedProduct;
};
