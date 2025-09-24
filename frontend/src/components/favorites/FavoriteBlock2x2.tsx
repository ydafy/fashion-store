import React from 'react';
import { View, StyleSheet } from 'react-native';

import FavoritePreviewItem from './FavoritePreviewItem';
import { Product } from '../../types/product';
import {
  PREVIEW_ITEM_WIDTH,
  PREVIEW_ITEM_HEIGHT,
  PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS,
} from './favoriteLayoutConstants';

// This type matches the product with the ID of the specific variant that was favorited.
export interface FavoriteItem extends Product {
  favoritedVariantId: string;
}

interface FavoriteBlock2x2Props {
  blockItems: FavoriteItem[];
  //  The `onItemPress` function now also works with variantId
  onItemPress: (product: Product, variantId: string) => void;
  blockWidth: number;
}

const ITEMS_PER_BLOCK = 4; // 2x2 grid

const FavoriteBlock2x2: React.FC<FavoriteBlock2x2Props> = ({
  blockItems,
  onItemPress,
  blockWidth,
}) => {
  return (
    <View style={[styles.blockContainer, { width: blockWidth }]}>
      {blockItems.map((item) => (
        <FavoritePreviewItem
          //  The 'key' is now more robust using the variant ID
          key={`${item.id}_${item.favoritedVariantId}`}
          product={item}
          //  We pass 'variantId' instead of 'colorCode' to the child component
          variantId={item.favoritedVariantId}
          onPress={() => onItemPress(item, item.favoritedVariantId)}
        />
      ))}
      {/* Fill with placeholders */}
      {Array.from({ length: ITEMS_PER_BLOCK - blockItems.length }).map(
        (_, index) => (
          <View key={`placeholder_${index}`} style={styles.placeholderItem} />
        ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  placeholderItem: {
    width: PREVIEW_ITEM_WIDTH,
    height: PREVIEW_ITEM_HEIGHT,
    marginBottom: PREVIEW_ITEM_MARGIN_BOTTOM_FOR_ROWS,
  },
});

export default FavoriteBlock2x2;
