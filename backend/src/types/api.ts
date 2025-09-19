import { Product } from './product';

// Tipos para las opciones de filtro que el backend calculará
export interface ApiFilterOption {
  value: string; // El valor del tag o el código de color/talla
  name: string; // El nombre para mostrar (ya traducido)
  hex?: string; // Código hexadecimal, solo para filtros de color
}

// Tipos para los grupos de filtros que se devolverán
export interface ApiFilterGroup {
  id: string; // ej. 'color', 'size', 'style'
  name: string; // ej. 'Color', 'Talla' (ya traducido)
  options: ApiFilterOption[];
}

// El tipo para la respuesta completa del endpoint de búsqueda
export interface ProductSearchResponse {
  products: Product[];
  availableFilters: {
    quickFilters: ApiFilterGroup[];
    modalFilters: ApiFilterGroup[];
    colors: ApiFilterOption[];
    sizes: ApiFilterOption[];
  };
  priceRange?: {
    min: number;
    max: number;
  };
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}
