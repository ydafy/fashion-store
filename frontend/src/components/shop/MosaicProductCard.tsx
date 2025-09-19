import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Product, TranslationObject } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { formatCurrency } from '../../utils/formatters';

interface MosaicProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const MosaicProductCard: React.FC<MosaicProductCardProps> = ({
  product,
  onPress,
}) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as keyof TranslationObject;

  const productName = product.name[lang] || product.name.es;
  const displayPrice = formatCurrency(product.price, i18n.language, 'USD');

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => onPress(product)}
    >
      <ExpoImage
        source={{ uri: product.variants[0].images[0].uri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      {discountPercentage && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>-{discountPercentage}%</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {productName}
        </Text>
        <Text style={styles.priceText}>{displayPrice}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    backgroundColor: COLORS.separator, // Fallback color
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  badgeContainer: {
    position: 'absolute',
    top: scale(8),
    left: scale(8),
    backgroundColor: COLORS.badgeSale,
    borderRadius: moderateScale(4),
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
  },
  badgeText: {
    color: COLORS.white,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  textContainer: {
    position: 'absolute',
    bottom: scale(10),
    left: scale(10),
    right: scale(10),
  },
  productName: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
    color: COLORS.white,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  priceText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(13),
    color: COLORS.white,
    marginTop: verticalScale(2),
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default MosaicProductCard;
