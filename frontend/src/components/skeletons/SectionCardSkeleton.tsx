import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors'; // Ajusta la ruta

const SectionCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.imagePlaceholder} // Cubre toda la tarjeta
        shimmerColors={[COLORS.lightGray, COLORS.separator, COLORS.lightGray]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white, // Fondo similar a SectionCard
    borderRadius: 15, // Mismo borderRadius
    overflow: 'hidden' // Importante para el shimmer
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%'
    // No necesita backgroundColor si el shimmer lo cubre
  }
});

export default SectionCardSkeleton;
