import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';

import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ✨ 1. Importamos el icono y los tipos correctos
import { ClockCounterClockwiseIcon } from 'phosphor-react-native';
import { useCart } from '../../contexts/CartContext';
import { Order } from '../../types/order';
import {
  RootStackParamList,
  ProfileStackParamList,
} from '../../types/navigation';
import * as orderService from '../../services/order';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { useOrderDetails } from '../../hooks/useOrderDetails';

import OrderDetailProductItem from '../../components/orders/OrderDetailProductItem';
import OrderInfoSection from '../../components/orders/OrderInfoSection';
import OrderCostSummarySection from '../../components/orders/OrderCostSummarySection';
import OrderShippingDetailsSection from '../../components/orders/OrderShippingDetailsSection';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import AuthButton from '../../components/auth/AuthButton';
import GlobalHeader from '../../components/common/GlobalHeader';

type OrderDetailScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'OrderDetail'
>;

const OrderDetailScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<OrderDetailScreenRouteProp>();
  const { orderId } = route.params;
  const {
    data: order,
    isLoading: loading,
    isError: hasError,
    error,
    refetch, // Obtenemos 'refetch' para el botón de reintentar
  } = useOrderDetails(orderId);
  const { addToCart } = useCart();
  const [isReordering, setIsReordering] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <GlobalHeader
          title={t('orders:detail.headerTitle')}
          showBackButton={true}
        />
      ),
      headerShown: true,
    });
  }, [navigation, t]);

  const handleReorder = async () => {
    if (!order || order.items.length === 0) return;

    setIsReordering(true);
    try {
      const results = await Promise.all(
        order.items.map((item) => addToCart(item)),
      );
      const itemsAddedSuccessfully = results.filter(
        (success) => success,
      ).length;

      if (itemsAddedSuccessfully > 0) {
        Toast.show({
          type: 'success',
          text1: t('orders:detail.reorder.successTitle'),
          text2: t('orders:detail.reorder.successMessage', {
            count: itemsAddedSuccessfully,
          }),
          // ✨ Navegación segura y explícita
          onPress: () =>
            navigation.navigate('MainTabs', {
              screen: 'Carrito',
              params: undefined,
            }),
        });
      }
      if (itemsAddedSuccessfully < order.items.length) {
        Toast.show({
          type: 'info',
          text1: t('orders:detail.reorder.partialFailureTitle'),
          text2: t('orders:detail.reorder.partialFailureMessage'),
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('common:error'),
        text2: t('orders:detail.reorder.genericError'),
      });
    } finally {
      setIsReordering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          title={t('orders:detail.headerTitle')}
          showBackButton={true}
        />
        <View style={styles.centered}>
          <LoadingIndicator />
        </View>
      </View>
    );
  }

  if (hasError || !order) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          title={t('orders:detail.headerTitle')}
          showBackButton={true}
        />
        <View style={styles.centered}>
          <ErrorDisplay
            title={t('orders:detail.errors.notFoundTitle')}
            message={
              error?.message || t('orders:detail.errors.notFoundMessage')
            }
            onRetry={refetch} // Usamos 'refetch' de TanStack Query
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.primaryBackground}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <OrderInfoSection order={order} />
        </View>
        <View style={styles.sectionContainer}>
          <OrderShippingDetailsSection order={order} />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {t('orders:detail.productsTitle', { count: order.items.length })}
          </Text>
          {order.items.map((item) => (
            // ✨ 2. Solución: La key ahora usa los IDs únicos y robustos
            <OrderDetailProductItem
              key={`${item.productId}-${item.variantId}-${item.inventoryId}`}
              item={item}
            />
          ))}
        </View>
        <View style={styles.sectionContainer}>
          <OrderCostSummarySection
            subtotal={order.subtotal}
            shippingCost={order.shippingCost}
            taxAmount={order.taxAmount}
            totalAmount={order.totalAmount}
          />
        </View>
        <View style={styles.reorderButtonContainer}>
          <AuthButton
            title={t('orders:detail.reorder.button')}
            onPress={handleReorder}
            isLoading={isReordering}
            // ✨ 3. Añadimos un icono para consistencia
            icon={
              <ClockCounterClockwiseIcon
                size={20}
                color={COLORS.primaryBackground}
                weight="bold"
              />
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

// --- ✨ Estilos con escalado aplicado consistentemente ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
    backgroundColor: COLORS.primaryBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: verticalScale(30),
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: scale(10),
    marginTop: verticalScale(15),
    borderRadius: moderateScale(8),
    overflow: 'hidden', // Para que los bordes redondeados se apliquen a los hijos
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600', // Un poco más de peso
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  reorderButtonContainer: {
    paddingHorizontal: scale(20), // Usamos 'scale' para padding horizontal
    paddingVertical: verticalScale(20), // Y 'verticalScale' para el vertical
    marginTop: verticalScale(10),
  },
});

export default OrderDetailScreen;
