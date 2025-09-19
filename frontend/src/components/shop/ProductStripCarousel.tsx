import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useProductStrip } from '../../hooks/useProductStrip';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import ProductCard from '../product/productCard';
import ProductCardSkeleton from '../skeletons/ProductCardSkeleton';
import SectionHeader from '../common/SectionHeader';
import ErrorDisplay from '../common/ErrorDisplay';
import EmptyState from '../common/EmptyState';
import { processUnknownError } from '../../utils/errorUtils';

import { scale, verticalScale } from '../../utils/scaling';
import { Product } from '../../types/product';

interface ProductStripCarouselProps {
  type: 'newArrivals' | 'recentlyViewed';
  title: string;
}

const ProductStripCarousel: React.FC<ProductStripCarouselProps> = ({
  type,
  title,
}) => {
  const { t } = useTranslation(['common', 'shop']);
  const { data: products, status, error, refetch } = useProductStrip(type);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleViewAllPress = () => {
    // Para 'Visto Recientemente', podríamos navegar a una pantalla de historial completa en el futuro.
    // Por ahora, solo activamos la navegación para 'Recién Llegados'.
    if (type === 'newArrivals') {
      navigation.navigate('MainTabs', {
        screen: 'ComprarTab',
        params: {
          screen: 'Section',
          params: {
            title: t('shop:productStrip.newArrivalsTitle'), // Usamos la misma clave de traducción
            isNew: true, // El parámetro clave que SectionScreen entenderá
            shouldResetFilters: true, // Para asegurar que empiece con una vista limpia
          },
        },
      });
    }
  };

  if (status === 'error') {
    const { messageKey, fallbackMessage } = processUnknownError(
      error,
      `shop:errors.${type}LoadFailed`,
    );

    return (
      <View style={styles.sectionContainer}>
        <SectionHeader title={title} />
        <View style={styles.errorContainer}>
          <ErrorDisplay
            message={t(messageKey) || fallbackMessage}
            subtext={t('shop:errors.tryAgainLater')}
            onRetry={refetch}
            style={styles.errorDisplay}
          />
        </View>
      </View>
    );
  }

  if (status === 'success' && (!products || products.length === 0)) {
    if (type === 'recentlyViewed') {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <SectionHeader title={title} />
        <EmptyState message={t('shop:noNewArrivals')} />
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader
        title={title}
        actionText={t('common:viewAll')}
        onActionPress={handleViewAllPress}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        accessibilityRole="scrollbar"
        accessibilityLabel={t(`shop:${type}.a11yLabel`)}
      >
        {status === 'pending'
          ? Array.from({ length: 4 }).map((_, index) => (
              <View
                key={`skeleton-${index}`}
                style={styles.cardContainer}
                testID={`${type}-skeleton-${index}`}
              >
                <ProductCardSkeleton />
              </View>
            ))
          : products?.map((product: Product) => (
              <View
                key={`${type}-${product.id}`}
                style={styles.cardContainer}
                testID={`${type}-product-${product.id}`}
              >
                <ProductCard product={product} />
              </View>
            ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(30),
    marginTop: verticalScale(30),
  },
  scrollContainer: {
    paddingHorizontal: scale(20),
  },
  cardContainer: {
    width: scale(160),
    marginRight: scale(15),
  },
  errorContainer: {
    minHeight: scale(200),
    justifyContent: 'center',
  },
  errorDisplay: {
    padding: scale(20),
  },
});

export default ProductStripCarousel;
