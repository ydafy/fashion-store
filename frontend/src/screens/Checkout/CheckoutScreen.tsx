import React, { useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FormProvider } from 'react-hook-form';
import {
  BottomSheetModal,
  BottomSheetFlatList,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
// ✨ 1. Importamos el nuevo icono
import { CaretDownIcon } from 'phosphor-react-native';

import { useCheckout } from '../../hooks/useCheckout';
import CheckoutSummaryItem from '../../components/checkout/CheckoutSummaryItem';
import ScreenContent from '../../components/checkout/ScreenContent';
import { CartItem } from '../../types/cart';
import { COLORS } from '../../constants/colors';
import { CheckoutScreenProps } from '../../types/navigation';
import { scale, verticalScale, moderateScale } from '../../utils/scaling';

const CheckoutScreen = ({ navigation }: CheckoutScreenProps) => {
  const { t } = useTranslation();
  const {
    methods,
    cartItems,
    cartTotal,
    selectedAddress,
    pickupLocations,
    loadingPickup,
    errorPickup,
    isConfirmingOrder,
    selectedMethod,
    selectedPickupLocation,
    paymentMethods,
    isLoadingPaymentMethods,
    mutatingCardId, // <-- La nueva prop
    handleSelectMethod,
    handleSelectPickupLocation,
    handleConfirmOrder,
    handleSelectCard, // <-- La nueva prop
    handleDeleteCard, // <-- La nueva prop
  } = useCheckout();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('checkout:content.mainTitle'),
    });
  }, [navigation, t]);

  const summarySheetRef = useRef<BottomSheetModal>(null);
  const summarySnapPoints = useMemo(() => ['85%'], []);
  const handleOpenSummarySheet = useCallback(
    () => summarySheetRef.current?.present(),
    [],
  );
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const formatProductCount = (count: number): string =>
    t('checkout:productCount', { count });

  // ✨ 2. Solución: keyExtractor actualizado para usar los IDs únicos
  const summaryKeyExtractor = (item: CartItem) =>
    `${item.productId}-${item.variantId}-${item.inventoryId}`;

  const renderSummaryItem = ({ item }: { item: CartItem }) => (
    <CheckoutSummaryItem item={item} />
  );

  return (
    <FormProvider {...methods}>
      <View style={styles.flexContainer}>
        <TouchableOpacity
          style={styles.miniHeaderContainer}
          onPress={handleOpenSummarySheet}
          activeOpacity={0.7}
          disabled={cartItems.length === 0}
          accessibilityRole="button"
          accessibilityLabel={t('checkout:summaryTitle')}
        >
          <Text style={styles.miniHeaderText}>
            {formatProductCount(cartItems.length)}
          </Text>
          {cartItems.length > 0 && (
            // ✨ 3. Usamos el nuevo icono de Phosphor
            <CaretDownIcon
              size={moderateScale(22)}
              color={COLORS.primaryText}
              weight="bold"
            />
          )}
        </TouchableOpacity>

        <KeyboardAwareScrollView
          style={styles.awareScrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenContent
            selectedMethod={selectedMethod}
            selectedAddress={selectedAddress}
            selectedPickupLocation={selectedPickupLocation}
            pickupLocations={pickupLocations}
            loadingPickup={loadingPickup}
            errorPickup={errorPickup}
            cartTotal={cartTotal}
            isConfirmingOrder={isConfirmingOrder}
            paymentMethods={paymentMethods}
            isLoadingPaymentMethods={isLoadingPaymentMethods}
            mutatingCardId={mutatingCardId} // <-- Pasamos la prop
            handleSelectMethod={handleSelectMethod}
            handleSelectPickupLocation={handleSelectPickupLocation}
            handleConfirmOrder={handleConfirmOrder}
            handleSelectCard={handleSelectCard} // <-- Pasamos la prop
            handleDeleteCard={handleDeleteCard} // <-- Pasamos la prop
          />
        </KeyboardAwareScrollView>

        <BottomSheetModal
          ref={summarySheetRef}
          index={0}
          snapPoints={summarySnapPoints}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.modalHandle}
        >
          <View style={styles.modalContentContainer}>
            <Text style={styles.modalTitle}>{t('checkout:summaryTitle')}</Text>
            <BottomSheetFlatList
              data={cartItems}
              keyExtractor={summaryKeyExtractor}
              renderItem={renderSummaryItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </BottomSheetModal>
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  awareScrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    padding: moderateScale(20),
  },
  miniHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    backgroundColor: COLORS.primaryBackground,
  },
  miniHeaderText: {
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  modalHandle: {
    backgroundColor: COLORS.separator,
    width: scale(40),
  },
  modalContentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    color: COLORS.primaryText,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default CheckoutScreen;
