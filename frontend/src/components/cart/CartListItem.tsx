/* eslint-disable react-native/no-color-literals */
import React, { useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
// --- Constants and Utils ---
import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatters';
import { moderateScale } from '../../utils/scaling';

// --- Types and Components ---
import { CartItem } from '../../types/cart';

// --- Context ---
import { useCart } from '../../contexts/CartContext';

// Helper to create a unique ID for each item in the cart
const generateItemId = (
  item: Pick<CartItem, 'productId' | 'variantId' | 'inventoryId'>,
): string => {
  // The new ID is more robust because it is based on the backend's unique IDs
  return `${item.productId}-${item.variantId}-${item.inventoryId}`;
};

interface CartListItemProps {
  item: CartItem;
}

const QUANTITY_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const CartListItem: React.FC<CartListItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const { removeFromCart, updateQuantity, mutatingItemId } = useCart();

  // We use a unique ID to simplify calls
  const itemId = useMemo(() => generateItemId(item), [item]);
  const isMutating = mutatingItemId === itemId;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['65%'], []);

  const handleOpenQuantityModal = useCallback(
    () => bottomSheetModalRef.current?.present(),
    [],
  );
  const handleCloseQuantityModal = useCallback(
    () => bottomSheetModalRef.current?.dismiss(),
    [],
  );

  const handleSelectQuantity = useCallback(
    (quantity: number) => {
      updateQuantity(itemId, quantity);
      handleCloseQuantityModal();
    },
    [itemId, updateQuantity, handleCloseQuantityModal],
  );

  const handleRemoveFromModal = useCallback(() => {
    removeFromCart(itemId);
    handleCloseQuantityModal();
  }, [itemId, removeFromCart, handleCloseQuantityModal]);

  const accessibilityLabel = t('cart:item.accessibilityLabel', {
    name: item.name,
    quantity: item.quantity,
    subtotal: formatCurrency(item.price * item.quantity),
  });

  return (
    <>
      <View
        style={styles.container}
        accessibilityLabel={accessibilityLabel}
        accessible
      >
        {/* --- Top Row --- */}
        <View style={styles.topSection}>
          <ExpoImage
            source={{ uri: item.image }}
            style={styles.image}
            placeholder={item.blurhash || 'L6PZfSi_.AyE_3t7t7Rj~qofbHof'}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.descriptionText}>
              {`${t('cart:item.colorLabel')} ${item.colorName} - ${t(
                'cart:item.sizeLabel',
              )} ${item.size}`}
            </Text>
            <Text style={styles.descriptionText}>
              {`${t('cart:item.pricePerUnitLabel')} ${formatCurrency(
                item.price,
              )}`}
            </Text>
          </View>
        </View>

        {/* --- Bottom Row --- */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.quantitySelector}
            onPress={handleOpenQuantityModal}
            disabled={isMutating}
            accessibilityRole="button"
            accessibilityLabel={t('cart:item.changeQuantity')}
          >
            <Text style={styles.quantitySelectorText}>{`${t(
              'cart:item.quantityLabel',
            )} ${item.quantity}`}</Text>
            <Ionicons
              name="chevron-down-outline"
              size={moderateScale(20)}
              color={COLORS.secondaryText}
            />
          </TouchableOpacity>

          {/*  We show a spinner if the item is being updated  */}
          {isMutating ? (
            <ActivityIndicator
              style={styles.mutatingSpinner}
              size="small"
              color={COLORS.primaryText}
            />
          ) : (
            <Text style={styles.subtotalText}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          )}
        </View>
      </View>

      {/* --- BottomSheetModal--- */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.modalHandle}
        backgroundStyle={{ backgroundColor: COLORS.white }}
      >
        <BottomSheetView style={styles.modalContentContainer}>
          <TouchableOpacity
            style={styles.modalRemoveButton}
            onPress={handleRemoveFromModal}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="red"
              style={styles.modalRemoveIcon}
            />
            <Text style={styles.modalRemoveButtonText}>
              {t('cart:item.modal.removeItemButton')}
            </Text>
          </TouchableOpacity>
          <View style={styles.modalSeparator} />
          <ScrollView
            style={styles.modalQuantityList}
            showsVerticalScrollIndicator={false}
          >
            {QUANTITY_OPTIONS.map((qty) => (
              <TouchableOpacity
                key={qty}
                style={[
                  styles.modalQuantityItem,
                  item.quantity === qty && styles.modalQuantityItemSelected,
                ]}
                onPress={() => handleSelectQuantity(qty)}
              >
                <Text
                  style={[
                    styles.modalQuantityText,
                    item.quantity === qty && styles.modalQuantityTextSelected,
                  ]}
                >
                  {qty}
                </Text>
                {item.quantity === qty && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.accent}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  topSection: { flexDirection: 'row', marginBottom: moderateScale(15) },
  image: {
    width: moderateScale(100),
    height: moderateScale(150),
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: COLORS.primaryBackground,
  },
  detailsContainer: { flex: 1, justifyContent: 'flex-start' },
  name: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    lineHeight: moderateScale(21),
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  quantitySelectorText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    marginRight: 8,
  },
  subtotalText: {
    fontSize: moderateScale(17),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  mutatingSpinner: { marginRight: moderateScale(10) },

  modalHandle: { backgroundColor: '#ccc', width: 40 },
  modalContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  modalRemoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalRemoveIcon: { marginRight: 10 },
  modalRemoveButtonText: {
    fontSize: 16,
    color: 'red',
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: COLORS.separator,
    marginVertical: 15,
  },
  modalQuantityList: {},
  modalQuantityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  modalQuantityItemSelected: {},
  modalQuantityText: {
    fontSize: 15,
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
  },
  modalQuantityTextSelected: {
    fontWeight: '500',
    color: COLORS.accent,
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default CartListItem;
