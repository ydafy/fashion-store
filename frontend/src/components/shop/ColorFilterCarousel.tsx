import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';

import { useFeaturedColors } from '../../hooks/useFeaturedColors';
import { FeaturedColor } from '../../types/featuredColor';
import { RootStackParamList } from '../../types/navigation';
import { TranslationObject } from '../../types/category';

import SectionHeader from '../common/SectionHeader';
import { Skeleton } from '../skeletons/Skeleton';

import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import ErrorDisplay from '../common/ErrorDisplay';

const ColorCardSkeleton = () => (
  <View style={styles.cardContainer}>
    <Skeleton style={styles.imagePart} />
    <Skeleton style={styles.textPart} />
  </View>
);

const ColorFilterCarousel: React.FC = () => {
  const { t, i18n } = useTranslation(['shop', 'common']);
  const lang = i18n.language as keyof TranslationObject;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: featuredColors, status, refetch } = useFeaturedColors();

  const handleColorPress = useCallback(
    (color: FeaturedColor) => {
      const colorName = color.colorName[lang] || color.colorName.es;
      navigation.navigate('MainTabs', {
        screen: 'ComprarTab',
        params: {
          screen: 'Section',
          params: {
            title: t('shop:colorFilter.resultsTitle', { color: colorName }),
            filterPayload: { colors: [color.colorCode] },
          },
        },
      });
    },
    [navigation, t, lang],
  );

  if (status === 'error') {
    return (
      <ErrorDisplay
        message={t('common:errors.loadingError')}
        onRetry={refetch}
      />
    );
  }

  if (status === 'success' && !featuredColors?.length) {
    return null; // No renderizar nada si no hay colores disponibles
  }

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader title={t('shop:colorFilter.title')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {status === 'pending'
          ? Array.from({ length: 5 }).map((_, index) => (
              <ColorCardSkeleton key={index} />
            ))
          : featuredColors?.map((color) => {
              const colorName = color.colorName[lang] || color.colorName.es;
              // Decidimos el color del texto para asegurar legibilidad
              const textColor =
                color.colorCode.toLowerCase() === COLORS.white.toLowerCase() ||
                color.colorCode.toLowerCase() === COLORS.beige.toLowerCase()
                  ? COLORS.primaryText
                  : COLORS.white;

              return (
                <TouchableOpacity
                  key={color.colorCode}
                  style={styles.cardContainer}
                  onPress={() => handleColorPress(color)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t('common:filterBy')} ${colorName}`}
                >
                  <ExpoImage
                    source={{ uri: color.textureImageUrl }}
                    style={styles.imagePart}
                    contentFit="cover"
                  />
                  <View
                    style={[
                      styles.textPart,
                      { backgroundColor: color.colorCode },
                    ]}
                  >
                    <Text style={[styles.colorName, { color: textColor }]}>
                      {colorName}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(30),
    marginTop: verticalScale(0),
  },
  scrollContainer: { paddingHorizontal: scale(20) },
  cardContainer: {
    width: scale(110),
    height: verticalScale(140),
    borderRadius: moderateScale(60), // Bordes muy redondeados
    overflow: 'hidden',
    marginRight: scale(30),
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  imagePart: {
    flex: 1.2, // La imagen ocupa un poco más de la mitad
  },
  textPart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(5),
  },
  colorName: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
});

export default ColorFilterCarousel;
