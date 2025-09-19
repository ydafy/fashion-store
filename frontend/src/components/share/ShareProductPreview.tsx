import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';

// ✨ 1. Importamos los tipos correctos y quitamos el que ya no se usa
import { Product, ProductImage } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface ShareProductPreviewProps {
  product: Product | null;
  productName: string;
}

const ShareProductPreview: React.FC<ShareProductPreviewProps> = ({
  product,
  productName
}) => {
  const { t } = useTranslation();

  // ✨ 2. La lógica de la imagen ahora usa el tipo correcto y una dependencia más específica
  const imageObjectToDisplay: ProductImage | undefined = useMemo(() => {
    return product?.variants?.[0]?.images?.[0];
  }, [product?.variants]);

  if (!product) {
    return (
      <View style={[styles.container, styles.placeholderContainer]}>
        <Text style={styles.placeholderText}>
          {t('productShare:preview.loadingInfo')}
        </Text>
      </View>
    );
  }

  // ✨ 3. El label de accesibilidad ya no depende de 'category'
  const accessibilityLabel = t('productShare:preview.accessibilityLabel', {
    name: productName,
    brand: product.brand // Usamos la marca como info adicional
  });

  return (
    <View
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      accessible
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
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {productName}
        </Text>
        {/* ✨ 4. Mostramos la marca del producto en lugar de la categoría */}
        {product.brand && (
          <Text style={styles.brandText} numberOfLines={1}>
            {product.brand}
          </Text>
        )}
      </View>
    </View>
  );
};

// --- ESTILOS (con un pequeño añadido para el texto de la marca) ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15)
  },
  placeholderContainer: {
    justifyContent: 'center',
    height: verticalScale(80)
  },
  placeholderText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular'
  },
  image: {
    width: scale(60),
    height: verticalScale(95),
    borderRadius: moderateScale(6),
    marginRight: scale(12),
    backgroundColor: COLORS.primaryBackground
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(4)
  },
  // ✨ Renombramos 'categoryText' a 'brandText' para mayor claridad
  brandText: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular'
  }
});

export default ShareProductPreview;
