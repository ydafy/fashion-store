import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PaymentMethod } from '../../types/payment';

import LoadingIndicator from '../common/LoadingIndicator';
import { moderateScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';
import CheckoutPaymentMethodListItem from './CheckoutPaymentMethodListItem';

interface SavedPaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  selectedCardId: string | undefined;
  mutatingCardId: string | null;
  onSelect: (method: PaymentMethod) => void;
  onDelete: (method: PaymentMethod) => void;
}

const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({
  paymentMethods,
  isLoading,
  selectedCardId,
  mutatingCardId,
  onSelect,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingIndicator style={styles.centered} />;
  }

  // Note: We'll handle the 'empty' case in ScreenContent.
  // This component assumes that at least one method will always be passed to it.
  return (
    <View>
      <Text style={styles.title}>
        {t('checkout:payment.savedMethodsTitle')}
      </Text>
      {paymentMethods?.map((method) => (
        <CheckoutPaymentMethodListItem
          key={method.id}
          item={method}
          isSelected={selectedCardId === method.id}
          isMutating={mutatingCardId === method.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    marginVertical: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default SavedPaymentMethods;
