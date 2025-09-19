import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { HeartIcon } from 'phosphor-react-native';

import {
  Product,
  ProductVariant,
  ProductImage,
  DisplayBadge,
} from '../../types/product';
import { COLORS } from '../../constants/colors';
import { useFavorites } from '../../contexts/FavoritesContext';
import { formatCurrency } from '../../utils/formatters';
import { scale, verticalScale, moderateScale } from '../../utils/scaling';

//Navegacion
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShopStackParamList } from '../../types/navigation';

// ✨ Interfaz de Props simplificada
interface ProductCardProps {
  product: Product;
  displayVariantId?: string;
  onPress?: () => void;
  accessibilityHint?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  displayVariantId,
  onPress,
}) => {
  const { t, i18n } = useTranslation(['product', 'common']);
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    isMutating: favoritesIsMutating,
  } = useFavorites();

  const navigation =
    useNavigation<NativeStackNavigationProp<ShopStackParamList>>();

  // ✨ Lógica de traducción segura y explícita
  const lang = i18n.language as 'es' | 'en';
  const productName = product.name[lang] || product.name.es;
  const accessibilityHint = t('product:productCard.a11y.defaultHint');

  // ✨ Lógica de imagen simplificada
  const imageObjectToShow: ProductImage | undefined = useMemo(() => {
    const variantToDisplay = displayVariantId
      ? product.variants.find((v) => v.id === displayVariantId)
      : product.variants[0]; // Fallback a la primera variante si no se especifica

    return variantToDisplay?.images?.[0];
  }, [product.variants, displayVariantId]);
  const variantToOperate: ProductVariant | undefined = useMemo(() => {
    return displayVariantId
      ? product.variants.find((v) => v.id === displayVariantId)
      : product.variants[0];
  }, [product.variants, displayVariantId]);

  // ✨ Lógica de precios simplificada, asumiendo una moneda global
  const displayPrice = formatCurrency(product.price, i18n.language, 'USD');
  const displayOriginalPrice = product.originalPrice
    ? formatCurrency(product.originalPrice, i18n.language, 'USD')
    : null;

  // ✨ Lógica de favoritos simplificada
  const isCardFavorite = useMemo(() => {
    if (!variantToOperate) return false;
    return isFavorite(product.id, variantToOperate.id);
  }, [isFavorite, product.id, variantToOperate]);

  // ✨ Lógica de Badges
  const badge = useMemo(() => {
    if (!product.displayBadge) return null;

    const { textKey, type } = product.displayBadge;
    let text = '';

    // Lógica especial para el descuento
    if (type === 'sale' && textKey.includes('::')) {
      const [key, discount] = textKey.split('::');
      text = t(key, { discount });
    } else {
      text = t(textKey);
    }

    // Mapeamos el 'type' del backend a un estilo local
    const styleMap: Record<DisplayBadge['type'], object> = {
      sale: styles.badgeTextSale,
      new: styles.badgeTextNew,
      topSeller: styles.badgeTextTopSeller,
      lowStock: styles.badgeTextLowStock,
      outOfStock: styles.badgeTextOutOfStock,
    };

    return {
      text,
      style: styleMap[type] || styles.badgeTextNew,
    };
  }, [product.displayBadge, t]);

  const accessibilityLabel = useMemo(() => {
    if (displayOriginalPrice) {
      // Si el producto está en oferta, usamos la nueva clave detallada
      return t('product:productCard.a11y.saleLabel', {
        productName,
        originalPrice: displayOriginalPrice,
        salePrice: displayPrice,
      });
    }
    // Si no, usamos la etiqueta simple
    return `${productName}, ${displayPrice}`;
  }, [productName, displayPrice, displayOriginalPrice, t]);

  const heartScale = useSharedValue(1);
  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleToggleFavorite = useCallback(
    async (e: any) => {
      e.stopPropagation();
      if (favoritesIsMutating || !variantToOperate) return;

      heartScale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 200 }),
      );

      try {
        const wasPreviouslyFavorite = isCardFavorite;
        const action = wasPreviouslyFavorite ? removeFavorite : addFavorite;
        const success = await action(product.id, variantToOperate.id);

        // ✨ 2. Lógica para el Toast de ÉXITO restaurada
        if (success) {
          Toast.show({
            type: wasPreviouslyFavorite ? 'info' : 'success',
            text1: t(
              wasPreviouslyFavorite
                ? 'product:detail.actions.favoriteRemovedToast'
                : 'product:detail.actions.favoriteAddedToast',
            ),
            text2: productName, // Mostramos el nombre del producto para más contexto
          });
        } else {
          throw new Error('Favorite action failed');
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('common:error'),
          text2: t('product:card.toasts.favoriteErrorMessage'),
        });
      }
    },
    [
      isCardFavorite,
      favoritesIsMutating,
      product.id,
      variantToOperate,
      addFavorite,
      removeFavorite,
      heartScale,
      t,
      productName,
    ],
  );

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      const variantIdToNavigate = displayVariantId || product.variants[0]?.id;
      navigation.push('ProductDetail', {
        productId: product.id,
        initialVariantId: variantIdToNavigate,
      });
    }
    // 1. Navegamos primero al NAVEGADOR DE PESTAÑAS padre
  };
  if (!product || !variantToOperate) {
    // Fallback por si el producto no tiene variantes, para evitar crashes
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.cardButton}
      activeOpacity={0.8}
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={styles.cardContainer}>
        <View style={styles.imageWrapper}>
          <ExpoImage
            source={{ uri: imageObjectToShow?.uri }}
            style={styles.productImage}
            placeholder={imageObjectToShow?.blurhash}
            contentFit="cover"
            transition={300}
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            disabled={favoritesIsMutating}
            accessibilityRole="button"
            accessibilityLabel={
              isCardFavorite
                ? t('product:card.a11y.removeFromFavorites')
                : t('product:card.a11y.addToFavorites')
            }
            accessibilityState={{ selected: isCardFavorite }}
          >
            <Animated.View style={animatedHeartStyle}>
              <HeartIcon
                size={moderateScale(26)}
                color={isCardFavorite ? COLORS.error : COLORS.primaryText}
                weight={isCardFavorite ? 'fill' : 'regular'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {badge && (
            <View style={styles.badgeContainer}>
              <Text style={[styles.badgeTextBase, badge.style]}>
                {badge.text}
              </Text>
            </View>
          )}
          <Text style={styles.productName} numberOfLines={2}>
            {productName}
          </Text>
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.productPrice,
                displayOriginalPrice && styles.salePrice,
              ]}
            >
              {displayPrice}
            </Text>
            {displayOriginalPrice && (
              <Text style={styles.originalPriceText}>
                {displayOriginalPrice}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- ✨ ESTILOS
const styles = StyleSheet.create({
  cardButton: {},
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: verticalScale(8),
    right: scale(8),
    padding: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  contentContainer: {
    padding: moderateScale(10),
  },
  badgeContainer: {
    marginBottom: verticalScale(6),
  },
  badgeTextBase: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  badgeTextSale: {
    color: COLORS.error,
  },
  badgeTextNew: {
    color: COLORS.badgeNew,
  },
  badgeTextTopSeller: {
    color: COLORS.badgeTopSeller,
  },
  badgeTextOutOfStock: {
    color: COLORS.badgeOutOfStock,
  },
  badgeTextLowStock: {
    color: COLORS.badgeLowStock,
  },

  productName: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    minHeight: verticalScale(36),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  productPrice: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  salePrice: {
    color: COLORS.error,
  },
  originalPriceText: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    textDecorationLine: 'line-through',
    marginLeft: scale(8),
  },
});

export default ProductCard;
