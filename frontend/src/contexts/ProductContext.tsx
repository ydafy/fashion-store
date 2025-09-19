import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Product } from '../types/product';
import * as productService from '../services/product';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []); // <-- El array de dependencias vacío aquí también.

  // Carga inicial de los productos cuando el proveedor se monta
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Obtiene un producto por su ID desde la caché local del contexto.
   * Es una operación síncrona y muy rápida.
   */
  const getProductById = useCallback(
    (productId: string): Product | undefined => {
      return products.find((p) => p.id === productId);
    },
    [products],
  );

  const contextValue = useMemo(
    () => ({
      products,
      isLoading,
      error,
      fetchProducts,
      getProductById,
    }),
    [products, isLoading, error, fetchProducts, getProductById],
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
