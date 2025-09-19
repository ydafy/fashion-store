import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { Filters } from '../hooks/useProductSearch';

/**
 * @description Define la forma del valor que proveerá el FilterContext.
 * Ahora maneja un estado global de filtros en lugar de filtros por categoría.
 */
interface FilterContextType {
  /**
   * @description El estado global de filtros de la aplicación.
   */
  filters: Filters;
  /**
   * @description Los filtros iniciales de navegación que nunca se borran.
   */
  initialFilters: Filters;
  /**
   * @description Actualiza el estado completo de filtros.
   * @param newFilters El nuevo objeto de filtros.
   */
  setFilters: (newFilters: Filters) => void;
  /**
   * @description Establece los filtros iniciales de navegación.
   * @param initialFilters Los filtros con los que se navegó a la pantalla.
   */
  setInitialFilters: (initialFilters: Filters) => void;
  /**
   * @description Resetea los filtros a su estado inicial de navegación.
   */
  clearFilters: () => void;
  /**
   * @description Actualiza una sola propiedad del objeto de filtros.
   * @param key La clave del filtro a actualizar.
   * @param value El nuevo valor del filtro.
   */
  updateSingleFilter: (key: keyof Filters, value: any) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

/**
 * @description Proveedor del contexto que gestiona el estado global de los filtros.
 */
export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFiltersInternal] = useState<Filters>({});
  const [initialFilters, setInitialFiltersInternal] = useState<Filters>({});

  const setFilters = useCallback((newFilters: Filters) => {
    setFiltersInternal(newFilters);
  }, []);

  const setInitialFilters = useCallback((newInitialFilters: Filters) => {
    setInitialFiltersInternal(newInitialFilters);
  }, []);

  const clearFilters = useCallback(() => {
    // Resetea a los filtros iniciales de navegación
    setFiltersInternal(initialFilters);
  }, [initialFilters]);

  const updateSingleFilter = useCallback((key: keyof Filters, value: any) => {
    setFiltersInternal((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  }, []);

  const contextValue = {
    filters,
    initialFilters,
    setFilters,
    setInitialFilters,
    clearFilters,
    updateSingleFilter,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

/**
 * @description Hook personalizado para acceder fácilmente al FilterContext.
 */
export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
