import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { CommonActions, useNavigation } from '@react-navigation/native';

// --- Tipos y Hooks ---
import { Product } from '../../types/product';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Componentes ---
import SectionHeader from '../common/SectionHeader';
import HeroCarouselSkeleton from '../skeletons/HeroCarouselSkeleton';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_WIDTH = screenWidth;
const CAROUSEL_HEIGHT = verticalScale(550); // Mantenemos esta constante

interface HeroCarouselProps {
  products: Product[];
  isLoading: boolean;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ products, isLoading }) => {
  const { t, i18n } = useTranslation(['home', 'common', 'header']);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const progress = useSharedValue<number>(0);

  const handleViewAllPress = () => {
    navigation.navigate('MainTabs', {
      screen: 'ComprarTab',
      params: { screen: 'ComprarScreen' },
    });

    setTimeout(() => {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'MainTabs',
          params: {
            screen: 'ComprarTab',
            params: {
              screen: 'Section',
              params: {
                isNew: true,
                shouldResetFilters: true,
                title: t('header:newArrivals'),
              },
            },
          },
        }),
      );
    }, 10);
  };

  const handlePress = (product: Product) => {
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'ProductDetail',
        params: { productId: product.id },
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.sectionContainer}>
        <SectionHeader title={t('home:HerroCarousel.newArrivalsTitle')} />
        <HeroCarouselSkeleton />
      </View>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    // ✨ Cambiamos 'container' por 'sectionContainer'
    <View style={styles.sectionContainer}>
      <SectionHeader
        title={t('home:HerroCarousel.newArrivalsTitle')}
        actionText={t('common:viewAll')}
        onActionPress={handleViewAllPress}
      />
      <Carousel
        width={CAROUSEL_WIDTH}
        height={CAROUSEL_HEIGHT} // La altura fija se aplica aquí directamente
        data={products}
        onProgressChange={progress}
        loop
        autoPlay
        autoPlayInterval={3000}
        renderItem={({ item: product }) => {
          const productName =
            product.name[i18n.language as 'es' | 'en'] || product.name.es;

          return (
            <View style={styles.slide}>
              <ExpoImage
                source={{ uri: product.variants[0].images[0].uri }}
                style={styles.image}
                contentFit="cover"
                transition={500}
              />
              <View style={styles.overlay}>
                <Text style={styles.title} numberOfLines={2}>
                  {productName}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handlePress(product)}
                >
                  <Text style={styles.buttonText}>
                    {t('common:shopNowButton')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(30),
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    padding: moderateScale(24),
  },
  title: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(36),
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(30),
    alignSelf: 'flex-start',
    marginTop: verticalScale(16),
  },
  buttonText: {
    color: COLORS.primaryText,
    fontWeight: '600',
    fontSize: moderateScale(17),
  },
});

export default HeroCarousel;
