import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

// --- 1. IMPORTACIONES ---
// Contextos
import { useProducts } from '../../contexts/ProductContext';
import { useShareModal } from '../../contexts/ShareModalContext';
import { useCart } from '../../contexts/CartContext';
//Services
import { addRecentlyViewed } from '../../services/recentlyViewed';
// Tipos
import { ProductImage } from '../../types/product';
import { CartItem } from '../../types/cart';

import { RootStackParamList, HomeStackParamList } from '../../types/navigation';

// Componentes
import ProductPriceDisplay from '../../components/product/ProductPriceDisplay';
import ProductActions from '../../components/product/ProductActions';
import VariantSelectors from '../../components/product/VariantSelectors';
import ProductImageCarousel from '../../components/product/ProductImageCarousel';
import ProductPrimaryInfo from '../../components/product/ProductPrimaryInfo';
import ProductDescription from '../../components/product/ProductDescription';
import AccordionItem from '../../components/common/AccordionItem';
import GlobalHeader, {
  HeaderAction,
} from '../../components/common/GlobalHeader';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorDisplay from '../../components/common/ErrorDisplay';
// Iconos
import { ShareNetworkIcon, SmileySadIcon } from 'phosphor-react-native';
// Constantes y Utilidades
import { COLORS } from '../../constants/colors';
import { LOW_STOCK_THRESHOLD } from '../../constants/appConfig';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

// --- 2. DEFINICIONES Y CONSTANTES ---
const { width: screenWidth } = Dimensions.get('window');
const IMAGE_CONTAINER_WIDTH = screenWidth * 0.65;
const IMAGE_ASPECT_RATIO = 2 / 3;
const IMAGE_HEIGHT = IMAGE_CONTAINER_WIDTH / IMAGE_ASPECT_RATIO;

type ProductDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductDetail'
>;

// --- 3. COMPONENTE PRINCIPAL ---
const ProductDetailScreen = () => {
  // --- a. Hooks ---
  const { t, i18n } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId, initialVariantId } = route.params;

  const {
    getProductById,
    isLoading: isLoadingContext,
    error: contextError,
    fetchProducts,
  } = useProducts();
  const shareModal = useShareModal();
  const { addToCart } = useCart();

  // --- b. Estados Locales ---
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(
    null,
  );

  // --- c. Lógica de Datos y Estado Derivado (useMemo) ---
  const product = getProductById(productId);

  // --- f. Lógica de Renderizado Condicional ---
  if (isLoadingContext) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }
  if (!product || contextError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorDisplay
          //title={t('orders:detail.errors.notFoundTitle')}
          message={contextError || t('orders:detail.errors.notFoundMessage')}
          onRetry={fetchProducts}
        />
      </SafeAreaView>
    );
  }

  // --- Lógica de Datos y Traducción (AHORA QUE 'product' ESTÁ GARANTIZADO) ---
  const lang = i18n.language as 'es' | 'en';

  const { selectedVariant, selectedInventoryItem } = useMemo(() => {
    const variant = product.variants.find((v) => v.id === selectedVariantId);
    if (!variant) return { selectedVariant: null, selectedInventoryItem: null };
    const inventoryItem = variant.inventory.find(
      (i) => i.id === selectedInventoryId,
    );
    return {
      selectedVariant: variant,
      selectedInventoryItem: inventoryItem || null,
    };
  }, [product.variants, selectedVariantId, selectedInventoryId]);

  const productName = product.name[lang] || product.name.es;
  const productDescription =
    product.description[lang] || product.description.es;
  const productFabric = product.fabric[lang] || product.fabric.es;
  const productCare =
    product.careInstructions[lang] || product.careInstructions.es;
  const variantColorName = selectedVariant
    ? selectedVariant.colorName[lang] || selectedVariant.colorName.es
    : '';

  const imagesForCarousel: ProductImage[] = selectedVariant?.images || [];
  const isProductCompletelyOutOfStock = useMemo(
    () =>
      product.variants.every((v) => v.inventory.every((i) => i.stock === 0)),
    [product.variants],
  );
  const showLowStockMessage = useMemo(
    () =>
      selectedInventoryItem &&
      selectedInventoryItem.stock > 0 &&
      selectedInventoryItem.stock <= LOW_STOCK_THRESHOLD,
    [selectedInventoryItem],
  );

  // --- d. Lógica de Animación y Efectos Secundarios (useEffect, useLayoutEffect) ---
  const lowStockHeight = useSharedValue(0);
  const animatedLowStockWrapperStyle = useAnimatedStyle(() => ({
    height: lowStockHeight.value,
    overflow: 'hidden',
  }));

  useEffect(() => {
    if (!showLowStockMessage) {
      lowStockHeight.value = withTiming(0, { duration: 200 });
    }
  }, [showLowStockMessage]);

  useEffect(() => {
    let variantToSelectId: string | null = null;
    if (
      initialVariantId &&
      product.variants.some((v) => v.id === initialVariantId)
    ) {
      variantToSelectId = initialVariantId;
    } else {
      const firstAvailableVariant = product.variants.find((v) =>
        v.inventory.some((i) => i.stock > 0),
      );
      variantToSelectId =
        firstAvailableVariant?.id || product.variants[0]?.id || null;
    }
    setSelectedVariantId(variantToSelectId);
    setSelectedInventoryId(null);
  }, [product, initialVariantId]);

  useEffect(() => {
    // Solo se ejecuta si tenemos un productId y una variante ya seleccionada
    if (productId && selectedVariantId) {
      addRecentlyViewed({ productId, variantId: selectedVariantId });
    }
  }, [productId, selectedVariantId]); // Depende del estado, no de los params

  useLayoutEffect(() => {
    if (!product) return;
    const rightActions: HeaderAction[] = [
      {
        icon: (
          <ShareNetworkIcon
            size={moderateScale(24)}
            color={COLORS.primaryText}
          />
        ),
        onPress: () => shareModal.openShareModal(product),
        accessibilityLabelKey: 'product:detail.header.shareButtonLabel',
      },
    ];
    navigation.setOptions({
      header: () => (
        <GlobalHeader
          title={productName}
          showBackButton={true}
          rightActions={rightActions}
        />
      ),
      headerShown: true,
    });
  }, [navigation, product, productName, shareModal]);

  // --- e. Handlers de Eventos (useCallback) ---
  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant || !selectedInventoryItem) {
      Toast.show({
        type: 'info',
        text1: t('product:detail.toasts.incompleteSelectionMessageSize'),
      });
      return;
    }
    const newCartItem: CartItem = {
      productId: product.id,
      variantId: selectedVariant.id,
      inventoryId: selectedInventoryItem.id,
      sku: selectedInventoryItem.sku,
      name: productName || '',
      colorName: variantColorName || '',
      size: selectedInventoryItem.size,
      price: product.price,
      image: selectedVariant.images?.[0]?.uri || '',
      blurhash: selectedVariant.images?.[0]?.blurhash,
      quantity: 1,
      stock: selectedInventoryItem.stock,
    };
    const success = await addToCart(newCartItem);
    if (success)
      Toast.show({
        type: 'success',
        text1: t('product:detail.toasts.addedToCartSuccessTitle'),
        text2: t('product:detail.toasts.addedToCartSuccessMessage', {
          productName,
        }),
      });
  }, [
    product,
    selectedVariant,
    selectedInventoryItem,
    productName,
    variantColorName,
    addToCart,
    t,
  ]);

  // --- g. El `return` con el JSX ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.mainContent}>
          <View style={styles.imageContainer}>
            <ProductImageCarousel
              images={imagesForCarousel}
              productName={productName || ''}
              carouselWidth={IMAGE_CONTAINER_WIDTH}
              imageHeight={IMAGE_HEIGHT}
            />
          </View>
          <View style={styles.optionsPanel}>
            <VariantSelectors
              variants={product.variants}
              selectedVariantId={selectedVariantId}
              selectedInventoryId={selectedInventoryId}
              onVariantSelect={setSelectedVariantId}
              onSizeSelect={setSelectedInventoryId}
            />
            {isProductCompletelyOutOfStock === false &&
              selectedVariant &&
              selectedVariant.inventory.every((i) => i.stock === 0) && (
                <Text style={styles.variantOutOfStockText}>
                  {t('product:detail.stockMessages.unavailableInColor', {
                    colorName: variantColorName,
                  })}
                </Text>
              )}
          </View>
        </View>
        <View style={styles.productInfo}>
          <ProductPrimaryInfo
            name={productName || ''}
            rating={product.rating}
            ratingCount={product.ratingCount}
            brand={product.brand}
          />
          <Animated.View style={animatedLowStockWrapperStyle}>
            <View
              style={styles.lowStockContentInner}
              onLayout={(event) => {
                const measuredHeight = event.nativeEvent.layout.height;
                // La lógica de onLayout ahora es más simple:
                // si el mensaje debe mostrarse, animamos a la altura medida.
                if (showLowStockMessage) {
                  lowStockHeight.value = withSpring(measuredHeight, {
                    damping: 14,
                    stiffness: 120,
                  });
                }
              }}
            >
              {showLowStockMessage && selectedInventoryItem && (
                <Text style={styles.lowStockText}>
                  {t('product:detail.stockMessages.lowStockInSize', {
                    sizeName: selectedInventoryItem.size,
                  })}
                </Text>
              )}
            </View>
          </Animated.View>
          <ProductDescription
            description={productDescription || ''}
            title={t('product:detail.description.title')}
          />
          <ProductPriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            title={t('product:detail.priceDisplay.title')}
          />
          <ProductActions
            productId={product.id}
            productName={productName || ''}
            selectedVariantId={selectedVariantId}
            onAddToCart={handleAddToCart}
            isAddToCartDisabled={
              !selectedInventoryId || isProductCompletelyOutOfStock
            }
          />
          {(product.fabric || product.careInstructions) && (
            <View style={styles.accordionsContainer}>
              {product.fabric && (
                <AccordionItem
                  title={t('product:detail.accordion.fabricTitle')}
                >
                  <Text style={styles.accordionContentText}>
                    {productFabric || ''}
                  </Text>
                </AccordionItem>
              )}
              {product.careInstructions && (
                <AccordionItem title={t('product:detail.accordion.careTitle')}>
                  <Text style={styles.accordionContentText}>
                    {productCare || ''}
                  </Text>
                </AccordionItem>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        visible={isProductCompletelyOutOfStock}
        animationType="fade"
      >
        <Pressable
          style={styles.overlayBackground}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.outOfStockModalContainer}>
            <SmileySadIcon
              size={moderateScale(40)}
              color={COLORS.secondaryText}
            />
            <Text style={styles.outOfStockModalTitle}>
              {t('product:detail.outOfStockModal.title')}
            </Text>
            <Text style={styles.outOfStockModalMessage}>
              {t('product:detail.outOfStockModal.message')}
            </Text>
            <TouchableOpacity
              style={styles.outOfStockModalButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.outOfStockModalButtonText}>
                {t('common:ok')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

// --- 4. StyleSheet ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primaryBackground },
  scrollViewContent: { flexGrow: 1, paddingBottom: verticalScale(30) },
  mainContent: {
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  imageContainer: {
    width: '70%', // Ajusta según tu diseño
    aspectRatio: 2 / 3,
  },
  optionsPanel: {
    flex: 1,
    paddingLeft: scale(15),
  },
  productInfo: {
    paddingHorizontal: scale(20),
  },
  variantOutOfStockText: {
    color: COLORS.error,
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
    marginTop: verticalScale(8),
  },
  lowStockWrapper: {
    overflow: 'hidden', // Crucial para el efecto de "desplegado"
  },
  lowStockText: {
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.badgeLowStock,
    fontWeight: '500',
    paddingVertical: verticalScale(8), // Padding para que tenga algo de espacio
  },
  lowStockContentInner: {
    position: 'absolute',
  },
  accordionsContainer: {
    marginTop: verticalScale(20),
  },
  accordionContentText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    lineHeight: verticalScale(20),
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockModalContainer: {
    backgroundColor: COLORS.primaryBackground,
    padding: scale(25),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
  },
  outOfStockModalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  outOfStockModalMessage: {
    fontSize: moderateScale(16),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    textAlign: 'center',
    marginBottom: verticalScale(25),
  },
  outOfStockModalButton: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(40),
    borderRadius: moderateScale(8),
  },
  outOfStockModalButtonText: {
    color: COLORS.primaryBackground,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
