import React, { useState } from 'react'; // ✨ AÑADIDO: useState
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  usePaymentMethods,
  useDeletePaymentMethod,
  useSetDefaultPaymentMethod,
} from '../../hooks/usePaymentMethods';
import { ProfileStackParamList } from '../../types/navigation';
import { PaymentMethod } from '../../types/payment';

import GlobalHeader from '../../components/common/GlobalHeader';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import EmptyState from '../../components/common/EmptyState';
import PaymentMethodListItem from '../../components/profile/PaymentMethodListItem';
import { CreditCardIcon } from 'phosphor-react-native';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import AuthButton from '../../components/auth/AuthButton';

type PaymentsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Payments'
>;

const PaymentsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<PaymentsScreenNavigationProp>();

  const {
    data: paymentMethods,
    isLoading,
    isError,
    error,
  } = usePaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const setDefaultMutation = useSetDefaultPaymentMethod();

  // ✨ 1. AÑADIMOS EL ESTADO PARA EL FEEDBACK DE CARGA INDIVIDUAL ✨
  const [mutatingItemId, setMutatingItemId] = useState<string | null>(null);

  // ✨ 2. ACTUALIZAMOS LOS HANDLERS PARA USAR EL NUEVO ESTADO ✨
  const handleSetDefault = (item: PaymentMethod) => {
    setMutatingItemId(item.id);
    setDefaultMutation.mutate(item.id, {
      // onSettled se ejecuta siempre (éxito o error)
      onSettled: () => setMutatingItemId(null),
    });
  };

  const handleDelete = (item: PaymentMethod) => {
    Alert.alert(
      t('payments:delete.title'),
      t('payments:delete.message', { last4: item.last4 }),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('common:delete'),
          style: 'destructive',
          onPress: () => {
            setMutatingItemId(item.id);
            deleteMutation.mutate(item.id, {
              onSettled: () => setMutatingItemId(null),
            });
          },
        },
      ],
    );
  };

  const renderListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <Text style={styles.listHeaderTitle}>{t('payments:savedMethods')}</Text>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator style={styles.centeredMessageContainer} />;
    }
    if (isError) {
      return <ErrorDisplay message={error.message} />;
    }
    if (!paymentMethods || paymentMethods.length === 0) {
      return (
        <EmptyState
          icon={
            <CreditCardIcon
              size={moderateScale(48)}
              color={COLORS.secondaryText}
            />
          }
          message={t('payments:empty.title')}
          subtext={t('payments:empty.subtitle')}
        />
      );
    }

    return (
      <FlatList
        data={paymentMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // ✨ 3. PASAMOS LAS NUEVAS PROPS AL LIST ITEM ✨
          <PaymentMethodListItem
            item={item}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
            isMutating={mutatingItemId === item.id}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderListHeader}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('header:payments')} showBackButton />
      {renderContent()}
      <View style={styles.footer}>
        <AuthButton
          title={t('payments:addNew')}
          onPress={() => navigation.navigate('AddPaymentMethod')}
          disabled={deleteMutation.isPending || setDefaultMutation.isPending}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
  },
  listHeaderContainer: {
    marginBottom: verticalScale(20),
    paddingTop: verticalScale(16),
  },
  listHeaderTitle: {
    fontSize: moderateScale(22),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  footer: {
    padding: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
});

export default PaymentsScreen;
