import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

// ✨ 1. Importamos el icono para el EmptyState
import { MagnifyingGlassIcon } from 'phosphor-react-native';

import { Product } from '../../types/product';
import { RootStackParamList } from '../../types/navigation';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors'; // ✨ Importamos colores para el icono

import ProductCard from '../product/productCard';

import EmptyState from '../common/EmptyState';
import ErrorDisplay from '../common/ErrorDisplay';
import ProductCardSkeleton from '../skeletons/ProductCardSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const NUM_COLUMNS = 2;
const ITEM_SPACING = scale(15);
const SKELETON_COUNT = 6;

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
  onRetry,
}) => {
  const { t } = useTranslation(['shop', 'common']);
  // El navigation se obtiene aquí, pero ProductCard también lo obtiene internamente.
  // No es estrictamente necesario pasarlo como prop.

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCardWrapper}>
      <ProductCard product={item} />
    </View>
  );

  if (isLoading && products.length === 0) {
    return (
      <View style={styles.gridContainer}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <View key={`skeleton-${index}`} style={styles.productCardWrapper}>
            <ProductCardSkeleton />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        style={styles.centered}
        message={t('shop:grid.errorTitle')}
        subtext={error} // El mensaje de error técnico va como subtexto
        onRetry={onRetry}
      />
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() =>
        !isLoading && (
          <EmptyState
            style={styles.centered}
            icon={
              <MagnifyingGlassIcon
                size={moderateScale(48)}
                color={COLORS.secondaryText}
              />
            }
            message={t('shop:grid.emptyMessage')}
            subtext={t('shop:grid.emptySubtext')}
          />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    paddingTop: verticalScale(50),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ITEM_SPACING / 2,
    paddingTop: verticalScale(10),
  },
  listContentContainer: {
    paddingHorizontal: ITEM_SPACING / 2,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
    flexGrow: 1,
  },
  productCardWrapper: {
    flexBasis: '50%',
    padding: ITEM_SPACING / 2,
  },
});

export default ProductGrid;
