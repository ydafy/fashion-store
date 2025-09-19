import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

// ✨ 1. Importamos el nuevo icono y los contextos necesarios
import { HeartIcon, ShoppingCartSimpleIcon } from 'phosphor-react-native';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useCart } from '../../contexts/CartContext'; // Para el estado de carga
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import AuthButton from '../auth/AuthButton';
import LoadingIndicator from '../common/LoadingIndicator';

// ✨ 2. Props actualizadas para usar 'variantId'
interface ProductActionsProps {
  productId: string;
  selectedVariantId: string | null;
  onAddToCart: () => void;
  isAddToCartDisabled?: boolean;
  productName: string;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  productId,
  selectedVariantId,
  onAddToCart,
  isAddToCartDisabled = false,
  productName
}) => {
  const { t } = useTranslation();
  const {
    isFavorite,
    addFavorite,
    removeFavorite,
    isMutating: isFavoritesMutating
  } = useFavorites();
  const { loading: isCartLoading } = useCart(); // ✨ Usamos el estado de carga del contexto

  const currentVariantIsFavorite = useMemo(() => {
    return selectedVariantId ? isFavorite(productId, selectedVariantId) : false;
  }, [productId, selectedVariantId, isFavorite]);

  const heartScale = useSharedValue(1);
  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));

  const handleToggleFavorite = useCallback(async () => {
    if (!selectedVariantId) {
      Toast.show({
        type: 'info',
        text1: t('product:detail.toasts.selectColorFirstTitle'),
        text2: t('product:detail.toasts.selectColorFirstMessageFavorites')
      });
      return;
    }

    if (isFavoritesMutating) return;

    heartScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 200 }),
      withSpring(1)
    );

    try {
      const action = currentVariantIsFavorite ? removeFavorite : addFavorite;
      // ✨ La acción ahora usa 'selectedVariantId'
      const success = await action(productId, selectedVariantId);
      if (!success) throw new Error();

      // El toast se puede simplificar ya que el contexto podría manejarlo, pero lo dejamos aquí por ahora
      Toast.show({
        type: currentVariantIsFavorite ? 'info' : 'success',
        text1: t(
          currentVariantIsFavorite
            ? 'product:detail.actions.favoriteRemovedToast'
            : 'product:detail.actions.favoriteAddedToast'
        ),
        text2: productName
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common:error'),
        text2: t('product:detail.actions.favoriteErrorToastMessage')
      });
    }
  }, [
    currentVariantIsFavorite,
    selectedVariantId,
    productName,
    productId,
    addFavorite,
    removeFavorite,
    isFavoritesMutating,
    heartScale,
    t
  ]);

  const isFavoriteButtonDisabled = !selectedVariantId || isFavoritesMutating;

  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.iconButton,
          isFavoriteButtonDisabled && styles.disabledIcon
        ]}
        onPress={handleToggleFavorite}
        disabled={isFavoriteButtonDisabled}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={
          currentVariantIsFavorite
            ? t('product:detail.actions.removeFavoriteLabel')
            : t('product:detail.actions.addFavoriteLabel')
        }
        accessibilityState={{
          disabled: isFavoriteButtonDisabled,
          selected: currentVariantIsFavorite
        }}
      >
        <Animated.View style={animatedHeartStyle}>
          {isFavoritesMutating ? (
            <LoadingIndicator size="small" color={COLORS.primaryText} />
          ) : (
            // ✨ 3. Usamos el icono de Phosphor
            <HeartIcon
              size={moderateScale(28)}
              color={
                currentVariantIsFavorite ? COLORS.error : COLORS.primaryText
              }
              weight={currentVariantIsFavorite ? 'fill' : 'regular'}
            />
          )}
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.buyButtonContainer}>
        <AuthButton
          title={t('product:detail.actions.addToCartButton')}
          onPress={onAddToCart}
          isLoading={isCartLoading} // ✨ Usamos el estado de carga del CartContext
          disabled={isAddToCartDisabled}
          icon={
            <ShoppingCartSimpleIcon
              size={moderateScale(20)}
              color={COLORS.primaryBackground}
              weight="regular"
            />
          }
        />
      </View>
    </View>
  );
};

// --- ✨ Estilos con escalado aplicado ---
const styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(20)
  },
  iconButton: {
    width: moderateScale(55),
    height: moderateScale(55),
    borderRadius: moderateScale(27.5),
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  disabledIcon: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.7
  },
  buyButtonContainer: {
    flex: 1,
    marginLeft: scale(12)
  }
});

export default ProductActions;
