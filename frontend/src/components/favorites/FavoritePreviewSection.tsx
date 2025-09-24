import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ProfileStackParamList,
  RootStackParamList,
} from '../../types/navigation';
import { useFavorites } from '../../contexts/FavoritesContext';

import FavoriteBlock2x2, { FavoriteItem } from './FavoriteBlock2x2';
import FavoritePreviewItemSkeleton from '../skeletons/FavoritePreviewItemSkeleton';
import { Product } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale } from '../../utils/scaling';
import {
  CAROUSEL_SLIDE_WIDTH,
  CAROUSEL_HEIGHT,
} from './favoriteLayoutConstants';

const ITEMS_PER_BLOCK = 4;
const MAX_PREVIEW_ITEMS = 12;

const screenWidth = Dimensions.get('window').width;
const SECTION_HORIZONTAL_PADDING = scale(20);

type FavoritePreviewNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const FavoritePreviewSection: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<FavoritePreviewNavigationProp>();
  const { favoriteEntries, favoriteProducts, isLoading } = useFavorites();

  const carouselRef = useRef<ICarouselInstance>(null);
  const carouselProgress = useSharedValue<number>(0);

  //  Updated data prep logic to use 'variantId'
  const itemBlocksForCarousel = useMemo(() => {
    // We assume that favoriteEntries now has { productId: string, variantId: string }
    const itemsToDisplay = favoriteEntries
      .map((entry) => {
        const product = favoriteProducts.find((p) => p.id === entry.productId);
        // We create an object that complies with the 'FavoriteItem' interface
        return product
          ? { ...product, favoritedVariantId: entry.variantId }
          : null;
      })
      .filter((item): item is FavoriteItem => item !== null) // Type guard to ensure the type
      .slice(0, MAX_PREVIEW_ITEMS);

    const blocks: FavoriteItem[][] = [];
    for (let i = 0; i < itemsToDisplay.length; i += ITEMS_PER_BLOCK) {
      blocks.push(itemsToDisplay.slice(i, i + ITEMS_PER_BLOCK));
    }
    return blocks;
  }, [favoriteEntries, favoriteProducts]);

  const handleNavigateToFavorites = () => {
    navigation.navigate('FavoritesScreen');
  };

  //  Navigation handler updated to use 'variantId'
  const handleNavigateToProductDetail = (
    product: Product,
    variantId: string,
  ) => {
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'ProductDetail',
        params: { productId: product.id, initialVariantId: variantId },
      },
    });
  };

  if (!isLoading && itemBlocksForCarousel.length === 0) {
    return null;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('favorites:preview.title', { count: favoriteEntries.length })}
        </Text>
        {favoriteEntries.length > 0 && (
          <TouchableOpacity
            onPress={handleNavigateToFavorites}
            accessibilityRole="button"
            accessibilityLabel={t('common:viewAll')}
          >
            <Text style={styles.seeAllButtonText}>{t('common:viewAll')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading && itemBlocksForCarousel.length === 0 ? (
        <View style={styles.carouselContainer}>
          <View style={styles.skeletonBlockContainer}>
            {Array.from({ length: ITEMS_PER_BLOCK }).map((_, index) => (
              <FavoritePreviewItemSkeleton key={`skeleton_${index}`} />
            ))}
          </View>
        </View>
      ) : (
        <>
          <Carousel
            ref={carouselRef}
            width={screenWidth}
            height={CAROUSEL_HEIGHT}
            data={itemBlocksForCarousel}
            onProgressChange={carouselProgress}
            renderItem={({ item: block }) => (
              <View style={styles.carouselSlideWrapper}>
                <FavoriteBlock2x2
                  blockItems={block}
                  onItemPress={handleNavigateToProductDetail}
                  blockWidth={CAROUSEL_SLIDE_WIDTH}
                />
              </View>
            )}
            loop={itemBlocksForCarousel.length > 1}
            autoPlay={false}
          />
          {itemBlocksForCarousel.length > 1 && (
            <View style={styles.paginationWrapper}>
              <Pagination.Basic
                progress={carouselProgress}
                data={itemBlocksForCarousel}
                dotStyle={styles.paginationDot}
                activeDotStyle={{ backgroundColor: COLORS.primaryText }}
                containerStyle={styles.paginationContainer}
                size={moderateScale(8)}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: moderateScale(30),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(15),
    paddingHorizontal: SECTION_HORIZONTAL_PADDING,
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  seeAllButtonText: {
    fontSize: moderateScale(14),
    color: COLORS.accent,
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  carouselContainer: {
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonBlockContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: CAROUSEL_SLIDE_WIDTH,
  },
  carouselSlideWrapper: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: moderateScale(10),
  },
  paginationContainer: {},
  paginationDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(3.5),
    marginHorizontal: moderateScale(4),
    backgroundColor: COLORS.borderDefault,
  },
});

export default FavoritePreviewSection;
