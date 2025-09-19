import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel, {
  ICarouselInstance,
  Pagination
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Image as ExpoImage, ImageContentFit } from 'expo-image';
import { useTranslation } from 'react-i18next';

import { ProductImage } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale } from '../../utils/scaling';

const GENERIC_BLURHASH = 'L6PZfSi_.AyE_3t7t7Rj~qofbHof'; // Un placeholder genérico

interface ProductImageCarouselProps {
  images: ProductImage[];
  carouselWidth: number;
  imageHeight: number;
  contentFit?: ImageContentFit;
  productName: string; // ✨ 1. AÑADIMOS productName para la accesibilidad
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  carouselWidth,
  imageHeight,
  contentFit = 'contain',
  productName // ✨ Recibimos la nueva prop
}) => {
  const { t } = useTranslation();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [imageLoadErrors, setImageLoadErrors] = useState<
    Record<number, boolean>
  >({});

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => ({ ...prev, [index]: true }));
  };

  // Si no hay imágenes, muestra un único placeholder
  if (!images || images.length === 0) {
    return (
      <View
        style={[
          styles.carouselWrapper,
          { width: carouselWidth, height: imageHeight }
        ]}
      >
        <ExpoImage
          source={require('../../../assets/images/placeholder.png')}
          style={styles.carouselImage}
          contentFit="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.carouselWrapper, { width: carouselWidth }]}>
      <View
        accessibilityRole="image" // Lo anunciamos como una imagen (o "adjustable" si queremos que anuncie el cambio de slide)
        accessibilityLabel={t('product:detail.carousel.accessibilityLabel', {
          name: productName
        })}
      >
        <Carousel
          ref={ref}
          width={carouselWidth}
          height={imageHeight}
          data={images}
          onProgressChange={progress}
          loop={images.length > 1}
          autoPlay={false}
          // ✨ 2. ACCESIBILIDAD PARA EL CARRUSEL ✨

          renderItem={({ item, index }) => {
            const hasError = imageLoadErrors[index];
            const imageSource = hasError
              ? require('../../../assets/images/placeholder.png')
              : { uri: item.uri };

            return (
              <View style={styles.carouselItemContainer}>
                <ExpoImage
                  source={imageSource}
                  style={styles.carouselImage}
                  contentFit={hasError ? 'contain' : contentFit}
                  placeholder={item.blurhash || GENERIC_BLURHASH}
                  transition={300}
                  onError={() => handleImageError(index)}
                  // ✨ 3. ACCESIBILIDAD PARA CADA IMAGEN ✨
                  accessibilityLabel={t(
                    'product:detail.carousel.imageAccessibilityLabel',
                    {
                      name: productName,
                      index: index + 1,
                      total: images.length
                    }
                  )}
                />
              </View>
            );
          }}
        />
      </View>

      {images.length > 1 && (
        <View style={styles.paginationWrapper}>
          <Pagination.Basic
            progress={progress}
            data={images}
            dotStyle={styles.paginationDot}
            activeDotStyle={{ backgroundColor: COLORS.primaryText }}
            containerStyle={styles.paginationContainer}
            size={moderateScale(8)}
          />
        </View>
      )}
    </View>
  );
};

// --- ✨ 4. ESTILOS REFINADOS Y RESPONSIVOS ✨ ---
const styles = StyleSheet.create({
  carouselWrapper: {
    // El ancho y alto se pasan como props de estilo en línea
  },
  carouselItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  carouselImage: {
    width: '100%',
    height: '100%'
  },
  paginationWrapper: {
    // Posicionamos la paginación sobre la imagen
    position: 'absolute',
    bottom: moderateScale(10),
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  paginationContainer: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.7)' // Fondo semitransparente para legibilidad
  },
  paginationDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginHorizontal: moderateScale(4),
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
});

export default ProductImageCarousel;
