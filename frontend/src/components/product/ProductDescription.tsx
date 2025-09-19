import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';
import SectionHeader from '../common/SectionHeader';

interface ProductDescriptionProps {
  description: string | null | undefined;
  title: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
  title
}) => {
  if (!description) return null;

  return (
    // ✨ Accesibilidad: Agrupamos el header y la descripción para que se lean como un solo bloque.
    <View style={styles.container} accessible>
      <SectionHeader title={title} />
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
};

// ✨ Estilos refinados con `moderateScale`
const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(15)
  },
  descriptionText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText
  }
});

export default ProductDescription;
