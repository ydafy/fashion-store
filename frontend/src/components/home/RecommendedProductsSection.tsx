import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types/navigation'; // Asegúrate de importar tu RootStackParamList
import { Product } from '../../types/product';
import ProductCard from '../product/productCard';
import ProductCardSkeleton from '../skeletons/ProductCardSkeleton';
import SectionHeader from '../common/SectionHeader';
import EmptyState from '../common/EmptyState';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

const { width: screenWidth } = Dimensions.get('window');
const PRODUCT_CARD_SPACING = scale(15);

interface RecommendedProductsSectionProps {
  products: Product[];
  title?: string;
  isLoading: boolean;
}

const RecommendedProductsSection: React.FC<RecommendedProductsSectionProps> = ({
  products,
  title,
  isLoading,
}) => {
  const { t } = useTranslation(['home', 'common']); // ✨ 1. Añadimos 'common' para el texto "Ver todo"
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const sectionTitle = title || t('home:recommended.titleDefault');

  // ✨ 2. DEFINIMOS LA FUNCIÓN DE NAVEGACIÓN
  const handleViewAllPress = () => {
    console.log('Navegando a la pantalla de Productos Recomendados...');
    // Aquí irá la lógica de navegación real, por ejemplo:
    // navigation.navigate('MainTabs', {
    //   screen: 'ComprarTab',
    //   params: {
    //     screen: 'Section',
    //     params: { /* parámetros de filtro para recomendados */ },
    //   },
    // });
  };

  if (isLoading) {
    const skeletonData = Array.from({ length: 3 });
    return (
      <View style={styles.sectionWrapper}>
        <SectionHeader title={sectionTitle} />
        <FlatList
          data={skeletonData}
          renderItem={() => (
            <View style={styles.cardListItemContainer}>
              <ProductCardSkeleton />
            </View>
          )}
          keyExtractor={(_, index) => `skeleton-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          ItemSeparatorComponent={() => (
            <View style={{ width: PRODUCT_CARD_SPACING }} />
          )}
        />
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.sectionWrapper}>
        <SectionHeader title={sectionTitle} />
        <EmptyState
          message={t('home:recommended.emptyMessage')}
          style={styles.emptyState}
        />
      </View>
    );
  }

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.cardListItemContainer}>
      <ProductCard product={item} />
    </View>
  );

  // ✨ 3. HEMOS ELIMINADO POR COMPLETO la función 'renderProductListFooter'

  return (
    <View style={styles.sectionWrapper}>
      {/* ✨ 4. PASAMOS EL TEXTO Y LA FUNCIÓN AL SectionHeader */}
      <SectionHeader
        title={sectionTitle}
        actionText={t('common:viewAll')}
        onActionPress={handleViewAllPress}
      />
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => (
          <View style={{ width: PRODUCT_CARD_SPACING }} />
        )}
        // ✨ 5. HEMOS ELIMINADO POR COMPLETO la prop 'ListFooterComponent'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: verticalScale(20),
  },
  cardListItemContainer: {
    width: screenWidth * 0.43,
  },
  listContentContainer: {
    paddingHorizontal: PRODUCT_CARD_SPACING,
    paddingVertical: verticalScale(10),
  },
  // ✨ 6. HEMOS ELIMINADO LOS ESTILOS INNECESARIOS:
  //    - viewMoreCard
  //    - viewMoreContent
  //    - viewMoreText
  emptyState: {
    minHeight: verticalScale(200),
    paddingVertical: verticalScale(20),
  },
});

export default RecommendedProductsSection;
