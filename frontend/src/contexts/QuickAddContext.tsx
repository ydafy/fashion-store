import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useMemo
} from 'react';
import { Product } from '../types/product';

// ✨ 1. Actualizamos el tipo para el dato que guardaremos
interface QuickAddProductData {
  product: Product;
  variantId: string; // Usamos el ID de la variante, no el colorCode
}

// ✨ 2. Actualizamos el tipo del contexto
interface QuickAddContextType {
  isModalVisible: boolean;
  productData: QuickAddProductData | null;
  openQuickAddModal: (product: Product, variantId: string) => void;
  closeQuickAddModal: () => void;
}

const QuickAddContext = createContext<QuickAddContextType | undefined>(
  undefined
);

export const QuickAddProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // ✨ 3. El estado ahora guarda el nuevo tipo de dato
  const [productData, setProductData] = useState<QuickAddProductData | null>(
    null
  );

  // ✨ 4. La función 'open' ahora acepta 'variantId'
  const openQuickAddModal = useCallback(
    (product: Product, variantId: string) => {
      setProductData({ product, variantId });
      setIsModalVisible(true);
    },
    []
  );

  const closeQuickAddModal = useCallback(() => {
    setIsModalVisible(false);
    // Retrasamos la limpieza para una animación de cierre más suave
    setTimeout(() => {
      setProductData(null);
    }, 300);
  }, []);

  const value = useMemo(
    () => ({
      isModalVisible,
      productData,
      openQuickAddModal,
      closeQuickAddModal
    }),
    [isModalVisible, productData, openQuickAddModal, closeQuickAddModal]
  );

  return (
    <QuickAddContext.Provider value={value}>
      {children}
    </QuickAddContext.Provider>
  );
};

export const useQuickAddModal = (): QuickAddContextType => {
  const context = useContext(QuickAddContext);
  if (context === undefined) {
    throw new Error('useQuickAddModal must be used within a QuickAddProvider');
  }
  return context;
};
