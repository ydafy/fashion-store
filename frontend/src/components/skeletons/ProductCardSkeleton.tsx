import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient'; // ✨ Usar de expo-linear-gradient
import { COLORS } from '../../constants/colors'; // Ajusta la ruta

const { width: screenWidth } = Dimensions.get('window');

// Usaremos dimensiones similares a las de ProductCard y su contenedor
const CARD_WIDTH = screenWidth * 0.43; // Ancho que definiste para cardListItemContainer
const IMAGE_ASPECT_RATIO = 2 / 3; // El aspectRatio que usaste para la imagen
const IMAGE_HEIGHT = CARD_WIDTH * (1 / IMAGE_ASPECT_RATIO); // Altura calculada de la imagen

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.imagePlaceholder}
        shimmerColors={[COLORS.lightGray, COLORS.separator, COLORS.lightGray]} // Colores para el shimmer
      />
      <View style={styles.contentPlaceholder}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.textPlaceholderLine1}
          shimmerColors={[COLORS.lightGray, COLORS.separator, COLORS.lightGray]}
        />
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.textPlaceholderLine2}
          shimmerColors={[COLORS.lightGray, COLORS.separator, COLORS.lightGray]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white, // Mismo fondo que ProductCard
    borderRadius: 10 // Mismo borderRadius
    // overflow: 'hidden', // Si ProductCard lo tiene
    // marginBottom: 16, // El espaciado lo da la lista
  },
  imagePlaceholder: {
    width: '100%',
    height: IMAGE_HEIGHT, // Usa la altura calculada o la que coincida con tu ProductCard
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
    // No necesita backgroundColor si el shimmer lo cubre
  },
  contentPlaceholder: {
    padding: 10, // Mismo padding que en ProductCard contentContainer
    alignItems: 'flex-start'
  },
  textPlaceholderLine1: {
    width: '80%', // Simula una línea de texto para el nombre
    height: 14, // Altura similar a la fuente del nombre
    borderRadius: 4,
    marginBottom: 8 // Espacio similar al marginBottom del nombre
  },
  textPlaceholderLine2: {
    width: '50%', // Simula una línea de texto más corta para el precio
    height: 15, // Altura similar a la fuente del precio
    borderRadius: 4
  }
});

export default ProductCardSkeleton;
