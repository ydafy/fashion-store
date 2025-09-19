import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
// ✨ 1. Usamos SafeAreaView para un layout más seguro
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ✨ 2. Importamos el icono de Phosphor
import { ReceiptIcon } from 'phosphor-react-native';

import { useOrderHistory } from '../../hooks/useOrderHistory';
import { ProfileStackParamList } from '../../types/navigation';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling'; // ✨ Importamos todos los helpers
import GlobalHeader from '../../components/common/GlobalHeader';
import OrderListItem from '../../components/orders/OrderListItem';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import EmptyState from '../../components/common/EmptyState';

const OrderHistoryScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { orders, loading, error, retryFetch } = useOrderHistory();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <GlobalHeader title={t('orders:history.title')} showBackButton={true} />
      ),
      headerShown: true
    });
  }, [navigation, t]);

  if (loading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <LoadingIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <ErrorDisplay
          title={t('orders:history.error.title')}
          message={error}
          onRetry={retryFetch}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderListItem
            order={item}
            onPress={() =>
              navigation.navigate('OrderDetail', { orderId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            {/* ✨ 3. Solución: Usamos la nueva prop 'icon' con el componente de Phosphor */}
            <EmptyState
              icon={
                <ReceiptIcon
                  size={moderateScale(48)}
                  color={COLORS.secondaryText}
                />
              }
              message={t('orders:history.empty.title')}
              subtext={t('orders:history.empty.subtitle')}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// --- ✨ Estilos con escalado aplicado consistentemente ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
    // Usamos la altura de la pantalla menos un estimado del header para centrar bien
    // Esto es opcional, pero mejora el centrado del EmptyState
    height: '80%'
  },
  listContentContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(60),
    flexGrow: 1
  }
});

export default OrderHistoryScreen;
