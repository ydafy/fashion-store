import React from 'react';
import { View, StyleSheet } from 'react-native';

import FavoritePreviewItem from './FavoritePreviewItem';
import { Product } from '../../types/product';
import {
  PREVIEW_ITEM_WIDTH,
  PREVIEW_ITEM_HEIGHT,
  PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS
} from './favoriteLayoutConstants';

// ✨ 1. Definimos un tipo más claro para representar un ítem favorito
// Este tipo combina el producto con el ID de la variante específica que se marcó como favorita.
export interface FavoriteItem extends Product {
  favoritedVariantId: string;
}

interface FavoriteBlock2x2Props {
  blockItems: FavoriteItem[];
  // ✨ 2. La función `onItemPress` ahora también trabaja con variantId
  onItemPress: (product: Product, variantId: string) => void;
  blockWidth: number;
}

const ITEMS_PER_BLOCK = 4; // 2x2 grid

const FavoriteBlock2x2: React.FC<FavoriteBlock2x2Props> = ({
  blockItems,
  onItemPress,
  blockWidth
}) => {
  return (
    <View style={[styles.blockContainer, { width: blockWidth }]}>
      {blockItems.map((item) => (
        <FavoritePreviewItem
          // ✨ 3. La 'key' ahora es más robusta usando el ID de la variante
          key={`${item.id}_${item.favoritedVariantId}`}
          product={item}
          // ✨ 4. Pasamos 'variantId' en lugar de 'colorCode' al componente hijo
          variantId={item.favoritedVariantId}
          onPress={() => onItemPress(item, item.favoritedVariantId)}
        />
      ))}
      {/* Rellenar con placeholders (sin cambios en esta lógica) */}
      {Array.from({ length: ITEMS_PER_BLOCK - blockItems.length }).map(
        (_, index) => (
          <View key={`placeholder_${index}`} style={styles.placeholderItem} />
        )
      )}
    </View>
  );
};

// --- ESTILOS ORIGINALES (SIN MODIFICACIONES) ---
const styles = StyleSheet.create({
  blockContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  placeholderItem: {
    width: PREVIEW_ITEM_WIDTH,
    height: PREVIEW_ITEM_HEIGHT,
    marginBottom: PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS
  }
});

export default FavoriteBlock2x2;
