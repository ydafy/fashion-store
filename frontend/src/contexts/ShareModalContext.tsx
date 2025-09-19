import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useMemo
} from 'react';
import { useTranslation } from 'react-i18next';
import { Product, TranslationObject } from '../types/product';

// ✨ 1. Nuevo tipo para los datos que guardará el contexto
interface ShareData {
  product: Product;
  productName: string; // El nombre ya traducido
}

interface ShareModalContextType {
  isShareModalVisible: boolean;
  shareData: ShareData | null; // Usamos el nuevo tipo
  openShareModal: (product: Product) => void;
  closeShareModal: () => void;
}

const ShareModalContext = createContext<ShareModalContextType | undefined>(
  undefined
);

export const ShareModalProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const { i18n } = useTranslation(); // ✨ 2. Obtenemos i18n para saber el idioma
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);

  const openShareModal = useCallback(
    (product: Product) => {
      // ✨ 3. Al abrir, calculamos el nombre traducido y lo guardamos
      const lang = i18n.language as keyof TranslationObject;
      const productName = product.name[lang] || product.name.es;

      setShareData({ product, productName });
      setIsShareModalVisible(true);
    },
    [i18n.language]
  );

  const closeShareModal = useCallback(() => {
    setIsShareModalVisible(false);
    setTimeout(() => {
      setShareData(null);
    }, 300);
  }, []);

  const value = useMemo(
    () => ({
      isShareModalVisible,
      shareData, // Exponemos los nuevos datos
      openShareModal,
      closeShareModal
    }),
    [isShareModalVisible, shareData, openShareModal, closeShareModal]
  );

  return (
    <ShareModalContext.Provider value={value}>
      {children}
    </ShareModalContext.Provider>
  );
};

export const useShareModal = (): ShareModalContextType => {
  const context = useContext(ShareModalContext);
  if (context === undefined) {
    throw new Error('useShareModal must be used within a ShareModalProvider');
  }
  return context;
};
