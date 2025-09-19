import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatters';
import { moderateScale } from '../../utils/scaling';
import SectionHeader from '../common/SectionHeader';

interface ProductPriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  title: string;
}

const ProductPriceDisplay: React.FC<ProductPriceDisplayProps> = ({
  price,
  originalPrice,
  title
}) => {
  const { t } = useTranslation();

  // --- ✨ 1. Lógica de Precios y Descuentos Simplificada ✨ ---
  const isOnSale = typeof originalPrice === 'number' && originalPrice > price;
  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  // --- ✨ 2. Accesibilidad ✨ ---
  const accessibilityLabel = isOnSale
    ? t('product:detail.priceDisplay.saleAccessibilityLabel', {
        price: formatCurrency(price),
        originalPrice: formatCurrency(originalPrice!)
      })
    : t('product:detail.priceDisplay.regularAccessibilityLabel', {
        price: formatCurrency(price)
      });

  return (
    <View style={styles.container}>
      <SectionHeader title={title} style={styles.sectionHeader} />
      <View
        style={styles.priceContentContainer}
        accessible
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={[styles.priceText, isOnSale && styles.salePrice]}>
          {formatCurrency(price)}
        </Text>
        {isOnSale && (
          <Text style={styles.originalPriceText}>
            {formatCurrency(originalPrice!)}
          </Text>
        )}
        {isOnSale && discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {t('product:detail.priceDisplay.discountBadge', {
                discount: discountPercentage
              })}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// --- ✨ 3. Estilos Refinados y Responsivos ✨ ---
const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(15)
  },
  sectionHeader: {
    marginBottom: moderateScale(8)
  },
  priceContentContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceText: {
    fontSize: moderateScale(28),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600',
    color: COLORS.primaryText
  },
  salePrice: {
    color: COLORS.error // Usamos el color de error para ofertas, es más llamativo
  },
  originalPriceText: {
    fontSize: moderateScale(18),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    textDecorationLine: 'line-through',
    marginLeft: moderateScale(10)
  },
  discountBadge: {
    backgroundColor: COLORS.error,
    borderRadius: moderateScale(4),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    marginLeft: moderateScale(12)
  },
  discountText: {
    color: COLORS.white,
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    fontFamily: 'FacultyGlyphic-Regular'
  }
});

export default ProductPriceDisplay;
