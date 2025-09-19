import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
// Constants
import { COLORS } from '../../constants/colors';
import { scale } from '../../utils/scaling';

import {
  SKELETON_ITEM_WIDTH,
  SKELETON_ITEM_HEIGHT,
  SKELETON_ITEM_MARGIN_BOTTOM
} from '../favorites/favoriteLayoutConstants';

// Componente Skeleton para un ítem de la vista previa de favoritos
const FavoritePreviewItemSkeleton: React.FC = () => {
  return (
    <View style={styles.itemContainer}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.imagePlaceholder}
        shimmerColors={[COLORS.lightGray, COLORS.separator, COLORS.lightGray]}
      />
    </View>
  );
};
// --- Fin del Componente FavoritePreviewItemSkeleton ---

// --- Estilos para FavoritePreviewItemSkeleton ---
const styles = StyleSheet.create({
  itemContainer: {
    width: SKELETON_ITEM_WIDTH,
    height: SKELETON_ITEM_HEIGHT,
    marginBottom: SKELETON_ITEM_MARGIN_BOTTOM,
    backgroundColor: COLORS.white, // Fondo del skeleton
    borderRadius: 8
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  }
});
// --- Fin de Estilos ---

export default FavoritePreviewItemSkeleton;
