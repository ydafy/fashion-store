import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';

import { Product, ProductImage, TranslationObject } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { formatCurrency } from '../../utils/formatters';

interface QuickAddItemPreviewProps {
  product: Product;
  variantId: string;
  onPress?: () => void;
}

const QuickAddItemPreview: React.FC<QuickAddItemPreviewProps> = ({
  product,
  variantId,
  onPress,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as keyof TranslationObject;

  // --- Lógica de Datos y Traducción ---
  const { imageToDisplay, colorName, productName } = useMemo(() => {
    const variant =
      product.variants.find((v) => v.id === variantId) || product.variants[0];

    // Seleccionamos los strings traducidos
    const translatedProductName = product.name[lang] || product.name.es;
    const translatedColorName = variant.colorName[lang] || variant.colorName.es;

    return {
      imageToDisplay: variant?.images?.[0],
      colorName: translatedColorName,
      productName: translatedProductName,
    };
  }, [product, variantId, lang]);

  // Lógica de precios
  const isOnSale =
    product.originalPrice && product.originalPrice > product.price;
  const displayPrice = formatCurrency(product.price, i18n.language, 'USD');
  const displayOriginalPrice = product.originalPrice
    ? formatCurrency(product.originalPrice, i18n.language, 'USD')
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress} // El botón se deshabilita si no se pasa un onPress
      style={styles.touchableContainer}
    >
      <View style={styles.container}>
        <ExpoImage
          source={{ uri: imageToDisplay?.uri }}
          style={styles.image}
          placeholder={
            imageToDisplay?.blurhash || 'L6PZfSi_.AyE_3t7t7Rj~qofbHof'
          }
          contentFit="cover"
          transition={300}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {/* ✨ Usamos el string traducido */}
            {productName}
          </Text>
          <Text style={styles.colorText}>
            {/* ✨ Usamos el string traducido */}
            {colorName}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, isOnSale ? styles.salePrice : null]}>
              {displayPrice}
            </Text>
            {isOnSale && (
              <Text style={styles.originalPrice}>{displayOriginalPrice}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- ESTILOS ORIGINALES (SIN MODIFICACIONES) ---
const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: moderateScale(8),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: moderateScale(15),
  },
  image: {
    width: scale(90),
    height: verticalScale(150),
    borderRadius: moderateScale(8),
    marginRight: scale(15),
    backgroundColor: COLORS.primaryBackground,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  brandText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(4),
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(4),
  },
  colorText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(8),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  salePrice: {
    color: COLORS.error,
  },
  originalPrice: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    textDecorationLine: 'line-through',
    marginLeft: scale(8),
  },
});

export default QuickAddItemPreview;
