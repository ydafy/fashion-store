import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';

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
  //  We get i18n to use the current language in formatCurrency
  const { t, i18n } = useTranslation();

  //  Improved and centralized image search logic
  const imageObjectToDisplay: ProductImage | undefined = useMemo(() => {
    const variant = product.variants.find((v) => v.id === variantId);
    // If we don't find the variant (rare case), we use the first image of the first variant as a fallback
    return variant?.images?.[0] || product.variants?.[0]?.images?.[0];
  }, [product.variants, variantId]);

  //  The accessibility label now uses the correct language for currency formatting
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
