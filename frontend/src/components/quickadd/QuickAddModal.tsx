import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react';
import { View, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShoppingCartSimpleIcon, BagSimpleIcon } from 'phosphor-react-native'; // ✨ Importamos los iconos

import { useQuickAddModal } from '../../contexts/QuickAddContext';
import {
  ProductVariant,
  InventoryItem,
  TranslationObject
} from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../types/cart';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import { RootStackParamList } from '../../types/navigation';
import QuickAddItemPreview from './QuickAddItemPreview';
import QuickAddSizeSelector from './QuickAddSizeSelector';
import AuthButton from '../auth/AuthButton';

const QuickAddModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isModalVisible, productData, closeQuickAddModal } =
    useQuickAddModal();
  const { addToCart, loading: isCartLoading, isItemInCart } = useCart();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(
    null
  );

  const snapPoints = useMemo(() => [verticalScale(420)], []);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ... useEffect
  useEffect(() => {
    if (isModalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (isModalVisible) {
      setSelectedInventoryId(null);
    }
  }, [isModalVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) closeQuickAddModal();
    },
    [closeQuickAddModal]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const { selectedVariant, selectedInventoryItem } = useMemo(() => {
    if (!productData)
      return { selectedVariant: null, selectedInventoryItem: null };
    const variant = productData.product.variants.find(
      (v) => v.id === productData.variantId
    );
    if (!variant || !selectedInventoryId)
      return { selectedVariant: variant, selectedInventoryItem: null };
    const inventoryItem = variant.inventory.find(
      (item) => item.id === selectedInventoryId
    );
    return { selectedVariant: variant, selectedInventoryItem: inventoryItem };
  }, [productData, selectedInventoryId]);

  const currentItemIsInCart = useMemo(() => {
    if (!productData || !selectedInventoryId) return false;
    const cartItemId = `${productData.product.id}-${productData.variantId}-${selectedInventoryId}`;
    return isItemInCart(cartItemId);
  }, [productData, selectedInventoryId, isItemInCart]);

  const handleAddToCart = async () => {
    if (!productData || !selectedVariant || !selectedInventoryItem) {
      Toast.show({ type: 'info', text1: t('quickadd:selectSizeToast') });
      return;
    }

    if (currentItemIsInCart) {
      closeQuickAddModal();
      navigation.navigate('MainTabs', { screen: 'Carrito' });
      return;
    }

    // ✨ Lógica de construcción de CartItem un poco más segura
    const lang = i18n.language as keyof TranslationObject;
    const productName =
      productData.product.name[lang] || productData.product.name.es;
    const colorName =
      selectedVariant.colorName[lang] || selectedVariant.colorName.es;
    const image = selectedVariant.images?.[0];

    const newCartItem: CartItem = {
      productId: productData.product.id,
      variantId: selectedVariant.id,
      inventoryId: selectedInventoryItem.id,
      sku: selectedInventoryItem.sku,
      name: productName,
      colorName: colorName,
      size: selectedInventoryItem.size,
      price: productData.product.price,
      image: image?.uri || '', // Fallback a string vacío si no hay imagen
      blurhash: image?.blurhash,
      quantity: 1,
      stock: selectedInventoryItem.stock
    };

    const success = await addToCart(newCartItem);

    if (success) {
      Toast.show({ type: 'success', text1: t('quickadd:successToast') });
      closeQuickAddModal();
    }
  };

  const product = productData?.product;
  const variantId = productData?.variantId;
  const availableInventory = selectedVariant?.inventory || [];

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.modalHandle}
      backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {product && variantId && (
          <>
            <QuickAddItemPreview product={product} variantId={variantId} />
            <View style={styles.separator} />
            <QuickAddSizeSelector
              inventory={availableInventory}
              selectedInventoryId={selectedInventoryId}
              onSizeSelect={setSelectedInventoryId}
            />
            <View style={styles.footer}>
              <AuthButton
                title={
                  currentItemIsInCart
                    ? t('quickadd:viewInCartButton')
                    : t('quickadd:addToCartButton')
                }
                onPress={handleAddToCart}
                isLoading={isCartLoading}
                disabled={!selectedInventoryId}
                style={currentItemIsInCart ? styles.viewInCartButton : {}}
                textStyle={
                  currentItemIsInCart ? styles.viewInCartButtonText : {}
                }
                // ✨ Añadimos un icono al botón para mejorar la UI
                icon={
                  currentItemIsInCart ? (
                    <BagSimpleIcon
                      size={20}
                      color={COLORS.primaryText}
                      weight="bold"
                    />
                  ) : (
                    <ShoppingCartSimpleIcon
                      size={20}
                      color={COLORS.white}
                      weight="bold"
                    />
                  )
                }
              />
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

// --- ESTILOS ORIGINALES (con un pequeño ajuste para el icono del botón) ---
const styles = StyleSheet.create({
  modalHandle: {
    backgroundColor: COLORS.borderDefault,
    width: moderateScale(40)
  },
  contentContainer: { flex: 1 },
  separator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginHorizontal: moderateScale(15)
  },
  footer: {
    padding: moderateScale(15),
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    backgroundColor: COLORS.primaryBackground
  },
  viewInCartButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primaryText,
    borderWidth: 1.5
  },
  viewInCartButtonText: {
    color: COLORS.primaryText
  }
});

export default QuickAddModal;
