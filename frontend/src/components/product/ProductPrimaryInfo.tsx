import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✨ Cambiado a Ionicons
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface ProductPrimaryInfoProps {
  name: string;
  rating: number;
  ratingCount?: number;
  brand?: string;
}

const ProductPrimaryInfo: React.FC<ProductPrimaryInfoProps> = ({
  name,
  rating,
  ratingCount,
  brand
}) => {
  const { t } = useTranslation();
  const formattedRating = rating.toFixed(1);

  // ✨ 1. Creamos el label de accesibilidad completo para el bloque de rating ✨
  const ratingAccessibilityLabel = t(
    'product:detail.primaryInfo.ratingAccessibilityLabel',
    {
      rating: formattedRating,
      count: ratingCount || 0
    }
  );

  return (
    <View style={styles.container}>
      {brand && <Text style={styles.brandText}>{brand}</Text>}
      <View style={styles.nameRatingContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {name}
        </Text>

        {rating > 0 && (
          // ✨ 2. Hacemos que todo el contenedor de rating sea un único elemento accesible ✨
          <View
            style={styles.ratingContainer}
            accessible={true} // Le decimos al lector de pantalla que trate este View como un solo bloque
            accessibilityLabel={ratingAccessibilityLabel}
            accessibilityRole="text" // Lo anunciamos como texto informativo
          >
            <Ionicons
              name="star"
              size={moderateScale(18)}
              color={COLORS.warning}
              style={styles.starIcon}
            />
            <Text style={styles.ratingText}>{formattedRating}</Text>
            {ratingCount && ratingCount > 0 && (
              <Text style={styles.ratingCountText}>
                {t('product:detail.primaryInfo.ratingCountText', {
                  count: ratingCount
                })}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// --- ✨ 3. Estilos Refinados y Responsivos ✨ ---
const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScale(15)
  },
  brandText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    marginBottom: moderateScale(6),
    textTransform: 'uppercase' // Estilo común para marcas
  },
  nameRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  productName: {
    fontSize: moderateScale(26),
    fontWeight: '600',
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    flex: 1,
    marginRight: moderateScale(10)
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: moderateScale(4)
  },
  starIcon: {
    // Añadimos un estilo específico para el icono de estrella
    marginRight: moderateScale(5)
  },
  ratingText: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText
  },
  ratingCountText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    marginLeft: moderateScale(4)
  }
});

export default ProductPrimaryInfo;
