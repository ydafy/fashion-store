import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// ✨ 1. Importaciones clave
import { Image as ExpoImage } from 'expo-image'; // Reemplazar Image por expo-image
import { CartItem } from '../../types/cart';
import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatters';
import { moderateScale } from '../../utils/scaling';

// eslint-disable-next-line
const LOW_RES_PLACEHOLDER = require('../../../assets/images/placeholder.png');
const imageBlurhash = 'L6PZfSi_.AyE_3t7t7Rj~qofbHof';

interface CheckoutSummaryItemProps {
  /**
   * El objeto del item del carrito que se va a renderizar.
   */
  item: CartItem;
}

const CheckoutSummaryItem: React.FC<CheckoutSummaryItemProps> = ({ item }) => {
  // ✨ 2. Usar i18n
  const { t } = useTranslation();
  const subtotal = item.price * item.quantity;

  // ✨ 5. Construir un accessibilityLabel descriptivo
  const accessibilityLabel = t('checkout:summaryItem.accessibilityLabel', {
    name: item.name,
    quantity: item.quantity,
    color: item.colorName,
    size: item.size,
    subtotal: formatCurrency(subtotal),
  });

  return (
    <View
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      accessible
    >
      {/* ✨ 1. Usar ExpoImage */}
      <ExpoImage
        source={{ uri: item.image }}
        style={styles.image}
        placeholder={imageBlurhash || LOW_RES_PLACEHOLDER} // Usar blurhash si existe, o un placeholder genérico
        contentFit="cover" // Equivalente a resizeMode='cover' o 'stretch'
        transition={300}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>

        {/* ✨ 2. Textos internacionalizados */}
        <Text style={styles.variantText}>
          {t('checkout:summaryItem.variant', {
            color: item.colorName,
            size: item.size,
          })}
        </Text>
        <Text style={styles.quantityText}>
          {t('checkout:summaryItem.quantity', { count: item.quantity })}
        </Text>
      </View>

      {/* ✨ 3. Usar formatCurrency */}
      <Text style={styles.subtotalText}>{formatCurrency(subtotal)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(45), // Ajustar escala
    paddingHorizontal: moderateScale(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    backgroundColor: COLORS.white,
  },
  image: {
    width: moderateScale(100), // Ajustar con scaling
    height: moderateScale(150),
    borderRadius: moderateScale(6),
    marginRight: moderateScale(15),
    backgroundColor: COLORS.lightGray, // Un color de fondo para el placeholder
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: moderateScale(10),
  },
  name: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: COLORS.primaryText,
    marginBottom: moderateScale(4),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  variantText: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    marginBottom: moderateScale(4),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  quantityText: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  subtotalText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: COLORS.primaryText,
    textAlign: 'right',
    minWidth: moderateScale(70),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default CheckoutSummaryItem;
