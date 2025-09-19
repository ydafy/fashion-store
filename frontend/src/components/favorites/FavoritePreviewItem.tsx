import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';

// ✨ Importamos el tipo ProductImage, ya que Product no se usa completo aquí
import { Product, ProductImage } from '../../types/product';
import { COLORS } from '../../constants/colors';
import {
  PREVIEW_ITEM_WIDTH,
  PREVIEW_ITEM_HEIGHT,
  PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS,
} from './favoriteLayoutConstants';
import { formatCurrency } from '../../utils/formatters';

interface FavoritePreviewItemProps {
  product: Product;
  variantId: string;
  onPress: () => void;
}

const FavoritePreviewItem: React.FC<FavoritePreviewItemProps> = ({
  product,
  variantId,
  onPress,
}) => {
  // ✨ Obtenemos i18n para usar el idioma actual en formatCurrency
  const { t, i18n } = useTranslation();

  // ✨ Lógica de búsqueda de imagen mejorada y centralizada
  const imageObjectToDisplay: ProductImage | undefined = useMemo(() => {
    const variant = product.variants.find((v) => v.id === variantId);
    // Si no encontramos la variante (caso raro), usamos la primera imagen de la primera variante como fallback
    return variant?.images?.[0] || product.variants?.[0]?.images?.[0];
  }, [product.variants, variantId]);

  // ✨ El label de accesibilidad ahora usa el idioma correcto para el formato de moneda
  const accessibilityLabel = t('favorites:previewItem.accessibilityLabel', {
    name: product.name,
    price: formatCurrency(product.price, i18n.language, 'USD'),
  });

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <ExpoImage
        source={{ uri: imageObjectToDisplay?.uri }}
        style={styles.image}
        placeholder={
          imageObjectToDisplay?.blurhash || 'L6PZfSi_.AyE_3t7t7Rj~qofbHof'
        }
        contentFit="cover"
        transition={300}
      />
    </TouchableOpacity>
  );
};

// --- ESTILOS
const styles = StyleSheet.create({
  itemContainer: {
    width: PREVIEW_ITEM_WIDTH,
    height: PREVIEW_ITEM_HEIGHT,
    marginBottom: PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryBackground,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default FavoritePreviewItem;
