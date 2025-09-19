import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { CartItem } from '../types/cart';
import * as cartService from '../services/cart';

// ✨ 1. El nuevo helper para generar el ID único del ítem en el carrito.
// Este ID es consistente a través de toda la app (CartListItem, QuickAddModal, etc.)
const generateCartItemId = (
  item: Pick<CartItem, 'productId' | 'variantId' | 'inventoryId'>
): string => {
  return `${item.productId}-${item.variantId}-${item.inventoryId}`;
};

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  itemCount: number;
  loading: boolean;
  mutatingItemId: string | null;
  error: string | null;
  fetchCart: () => Promise<void>;
  // ✨ 2. addToCart ahora espera el objeto CartItem completo.
  addToCart: (newItem: CartItem) => Promise<boolean>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  isItemInCart: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutatingItemId, setMutatingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✨ 3. isItemInCart ahora usa el nuevo helper y es más simple.
  const isItemInCart = useCallback(
    (itemId: string): boolean => {
      return cartItems.some((item) => generateCartItemId(item) === itemId);
    },
    [cartItems]
  );

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCartItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (newItem: CartItem) => {
      const itemId = generateCartItemId(newItem);
      setMutatingItemId(itemId); // Indicamos que este item se está añadiendo

      const existingItem = cartItems.find(
        (item) => generateCartItemId(item) === itemId
      );
      if (existingItem) {
        // Si el item ya existe, actualizamos la cantidad
        return updateQuantity(itemId, existingItem.quantity + newItem.quantity);
      }

      // UI Optimista: Añadimos el nuevo item inmediatamente
      const originalItems = [...cartItems];
      setCartItems((prev) => [...prev, newItem]);

      try {
        await cartService.addToCart(newItem);
        return true;
      } catch (e: any) {
        setError(e.message);
        setCartItems(originalItems); // Rollback
        Toast.show({
          type: 'error',
          text1: t('common:error'),
          text2: e.message
        });
        return false;
      } finally {
        setMutatingItemId(null);
      }
    },
    [cartItems, t]
  );

  // ✨ 4. Toda la lógica interna ahora usa el nuevo generateCartItemId
  const updateQuantity = useCallback(
    async (itemId: string, newQuantity: number) => {
      if (newQuantity < 1) {
        return removeFromCart(itemId);
      }
      setMutatingItemId(itemId);
      const originalItems = [...cartItems];
      setCartItems((prev) =>
        prev.map((item) =>
          generateCartItemId(item) === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      try {
        // El servicio necesita el SKU o el ID único para saber qué actualizar en el backend
        const itemToUpdate = originalItems.find(
          (item) => generateCartItemId(item) === itemId
        );
        if (!itemToUpdate) throw new Error('Item not found for update');
        await cartService.updateItemQuantity(itemId, newQuantity);
        return true;
      } catch (e: any) {
        setError(e.message);
        setCartItems(originalItems);
        Toast.show({
          type: 'error',
          text1: t('common:error'),
          text2: e.message
        });
        return false;
      } finally {
        setMutatingItemId(null);
      }
    },
    [cartItems, t]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      setMutatingItemId(itemId);
      const originalItems = [...cartItems];
      setCartItems((prev) =>
        prev.filter((item) => generateCartItemId(item) !== itemId)
      );
      try {
        const itemToRemove = originalItems.find(
          (item) => generateCartItemId(item) === itemId
        );
        if (!itemToRemove) throw new Error('Item not found for removal');
        await cartService.removeFromCart(itemId);
        return true;
      } catch (e: any) {
        setError(e.message);
        setCartItems(originalItems);
        Toast.show({
          type: 'error',
          text1: t('common:error'),
          text2: e.message
        });
        return false;
      } finally {
        setMutatingItemId(null);
      }
    },
    [cartItems, t]
  );

  const clearCart = useCallback(async () => {
    setLoading(true);
    const originalItems = [...cartItems];
    setCartItems([]);
    try {
      await cartService.clearCart();
      return true;
    } catch (e: any) {
      setError(e.message);
      setCartItems(originalItems);
      Toast.show({ type: 'error', text1: t('common:error'), text2: e.message });
      return false;
    } finally {
      setLoading(false);
    }
  }, [cartItems, t]);

  const { itemCount, cartTotal } = useMemo(() => {
    return {
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    };
  }, [cartItems]);

  const contextValue = useMemo(
    () => ({
      cartItems,
      cartTotal,
      itemCount,
      loading,
      mutatingItemId,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isItemInCart
    }),
    [
      cartItems,
      cartTotal,
      itemCount,
      loading,
      mutatingItemId,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isItemInCart
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
