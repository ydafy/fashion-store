export type TranslationObject = {
  es: string;
  en: string;
};

export interface ProductImage {
  id: string;
  uri: string;
  blurhash?: string;
}

export interface DisplayBadge {
  textKey: string;
  type: 'sale' | 'new' | 'topSeller' | 'lowStock' | 'outOfStock';
}

export interface InventoryItem {
  id: string;
  size: string | number;
  stock: number;
  sku: string;
}

export interface ProductVariant {
  id: string;
  colorName: TranslationObject;
  colorCode: string;
  images: ProductImage[];
  inventory: InventoryItem[];
}

export interface Product {
  id: string;
  name: TranslationObject;
  description: TranslationObject;
  brand: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  tags: {
    es: string[];
    en: string[];
  };
  fabric: TranslationObject;
  careInstructions: TranslationObject;
  rating: number;
  ratingCount: number;
  isFeatured: boolean;
  displayBadge?: DisplayBadge;
  dateAdded: string;
  categoryId: string;
  variants: ProductVariant[];
}
