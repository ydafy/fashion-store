import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import { Product } from '../types/product';
import { API_BASE_URL } from '../config/api';
import { useAuth } from './AuthContext';

// ✨ 1. El tipo 'FavoriteEntry' ahora usa 'variantId'
export interface FavoriteEntry {
  productId: string;
  variantId: string; // El ID único de la variante (color) que se favoritó
}

interface FavoritesContextType {
  favoriteEntries: FavoriteEntry[];
  favoriteProducts: Product[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  // ✨ 2. Las firmas de las funciones ahora usan 'variantId'
  addFavorite: (productId: string, variantId: string) => Promise<boolean>;
  removeFavorite: (productId: string, variantId: string) => Promise<boolean>;
  isFavorite: (productId: string, variantId: string) => boolean;
  fetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { user, token } = useAuth();
  const [favoriteEntries, setFavoriteEntries] = useState<FavoriteEntry[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esta función es una simplificación. En un mundo ideal, el backend devolvería
  // los productos favoritos ya poblados para evitar esta segunda llamada.
  const fetchAllProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) throw new Error('Could not load products.');
      return await response.json();
    } catch (err) {
      console.error('[FavoritesContext] fetchAllProducts error:', err);
      return [];
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      // Si no hay usuario, nos aseguramos de que el estado esté limpio.
      setFavoriteEntries([]);
      setFavoriteProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${user.id}/favorites`
      );
      if (!response.ok) throw new Error('Could not load favorites.');

      const favEntriesData: FavoriteEntry[] = await response.json();
      setFavoriteEntries(favEntriesData);

      if (favEntriesData.length > 0) {
        const allProducts = await fetchAllProducts();
        if (allProducts.length > 0) {
          const favoriteProductIds = new Set(
            favEntriesData.map((fe) => fe.productId)
          );
          const favProds = allProducts.filter((p) =>
            favoriteProductIds.has(p.id)
          );
          setFavoriteProducts(favProds);
        } else {
          setFavoriteProducts([]);
        }
      } else {
        setFavoriteProducts([]);
      }
    } catch (err: any) {
      setError(err.message);
      setFavoriteEntries([]);
      setFavoriteProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchAllProducts]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]); // fetchFavorites ya depende de user.id

  const addFavorite = async (
    productId: string,
    variantId: string
  ): Promise<boolean> => {
    if (!user?.id || !productId || !variantId) {
      setError('User not authenticated or missing data.');
      return false;
    }
    setIsMutating(true);
    setError(null);
    try {
      // ✨ 3. La llamada a la API ahora envía 'variantId' en el body
      const response = await fetch(
        `${API_BASE_URL}/api/users/${user.id}/favorites`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, variantId })
        }
      );
      if (!response.ok) throw new Error('Failed to add favorite.');

      // En lugar de un re-fetch completo, podríamos hacer una actualización optimista
      setFavoriteEntries((prev) => [...prev, { productId, variantId }]);
      await fetchFavorites(); // Opcional: Re-fetch para consistencia total
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const removeFavorite = async (
    productId: string,
    variantId: string
  ): Promise<boolean> => {
    if (!user?.id || !productId || !variantId) {
      setError('User not authenticated or missing data.');
      return false;
    }
    setIsMutating(true);
    setError(null);
    try {
      // ✨ 4. La llamada a la API ahora envía 'variantId' como query param
      const url = `${API_BASE_URL}/api/users/${
        user.id
      }/favorites/${productId}?variantId=${encodeURIComponent(variantId)}`;
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok && response.status !== 204)
        throw new Error('Failed to remove favorite.');

      setFavoriteEntries((prev) =>
        prev.filter(
          (e) => !(e.productId === productId && e.variantId === variantId)
        )
      );
      await fetchFavorites(); // Opcional: Re-fetch para consistencia total
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const isFavorite = useCallback(
    (productId: string, variantId: string): boolean => {
      // ✨ 5. La lógica de comprobación ahora usa 'variantId'
      if (!productId || !variantId) return false;
      return favoriteEntries.some(
        (entry) =>
          entry.productId === productId && entry.variantId === variantId
      );
    },
    [favoriteEntries]
  );

  const contextValue = useMemo(
    () => ({
      favoriteEntries,
      favoriteProducts,
      isLoading,
      isMutating,
      error,
      addFavorite,
      removeFavorite,
      isFavorite,
      fetchFavorites
    }),
    [
      favoriteEntries,
      favoriteProducts,
      isLoading,
      isMutating,
      error,
      addFavorite,
      removeFavorite,
      isFavorite,
      fetchFavorites
    ]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
