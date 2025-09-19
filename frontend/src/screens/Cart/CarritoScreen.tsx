import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✨ Mejor usar esta para iOS

// ✨ 1. Importaciones de iconos y tipos
import { ShoppingCartIcon, CreditCardIcon } from 'phosphor-react-native';
import { CarritoScreenProps } from '../../types/navigation';
import { CartItem } from '../../types/cart';

import { useCart } from '../../contexts/CartContext';
import { useAddress } from '../../contexts/AddressContext';
import { COLORS } from '../../constants/colors';
import { DEFAULT_SHIPPING_COST } from '../../constants/appConfig';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import CartListItem from '../../components/cart/CartListItem';
import OrderCostSummarySection from '../../components/orders/OrderCostSummarySection';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import EmptyState from '../../components/common/EmptyState';
import AuthButton from '../../components/auth/AuthButton';
import { StatusBar } from 'expo-status-bar';

const CarritoScreen = ({ navigation }: CarritoScreenProps) => {
  const { t } = useTranslation();
  const { cartItems, cartTotal, itemCount, loading } = useCart();
  const { selectedAddress } = useAddress();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false // Mantenemos el header personalizado
    });
  }, [navigation]);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        t('cart:alerts.emptyCartTitle'),
        t('cart:alerts.emptyCartMessage')
      );
      return;
    }
    if (!selectedAddress) {
      Alert.alert(
        t('cart:alerts.addressRequiredTitle'),
        t('cart:alerts.addressRequiredMessage')
      );
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <CartListItem item={item} />
  );

  // ✨ 2. Solución: keyExtractor ahora usa los IDs únicos y robustos
  const keyExtractor = (item: CartItem) =>
    `${item.productId}-${item.variantId}-${item.inventoryId}`;

  if (loading && cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeAreaContainer}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style="dark" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {t('cart:title', { count: itemCount })}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        {cartItems.length === 0 ? (
          <View style={styles.centered}>
            {/* ✨ 3. Solución: EmptyState ahora usa la prop 'icon' con un componente de Phosphor */}
            <EmptyState
              icon={
                <ShoppingCartIcon
                  size={moderateScale(48)}
                  color={COLORS.secondaryText}
                />
              }
              message={t('cart:emptyMessage')}
              subtext={t('cart:emptySubtitle')}
            />
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={keyExtractor}
              style={styles.list}
              contentContainerStyle={styles.listContentContainer}
              ListFooterComponent={() => (
                <OrderCostSummarySection
                  subtotal={cartTotal}
                  shippingCost={DEFAULT_SHIPPING_COST}
                  totalAmount={cartTotal + DEFAULT_SHIPPING_COST}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.checkoutButtonContainer}>
              {/* ✨ 4. Añadimos un icono al botón de checkout para consistencia */}
              <AuthButton
                title={t('cart:checkoutButton')}
                onPress={handleCheckout}
                icon={
                  <CreditCardIcon
                    size={20}
                    color={COLORS.primaryBackground}
                    weight="bold"
                  />
                }
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// --- ✨ Estilos (Hechos más robustos para SafeAreaView) ✨ ---
const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: COLORS.primaryBackground },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20)
  },
  contentContainer: {
    flex: 1
  },
  headerContainer: {
    paddingHorizontal: moderateScale(20),
    // Eliminamos el paddingTop manual, SafeAreaView se encarga
    paddingBottom: moderateScale(15)
  },
  headerTitle: {
    fontSize: moderateScale(28), // Un poco más grande para un look más moderno
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    textAlign: 'left'
  },
  list: { flex: 1 },
  listContentContainer: { paddingBottom: verticalScale(20) },
  checkoutButtonContainer: {
    padding: moderateScale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    backgroundColor: COLORS.primaryBackground
  }
});

export default CarritoScreen;
