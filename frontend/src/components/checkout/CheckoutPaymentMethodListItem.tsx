import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TrashIcon, CheckCircleIcon } from 'phosphor-react-native';

import { PaymentMethod } from '../../types/payment';
import BrandIcon, { BrandName } from '../common/BrandIcon';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface CheckoutPaymentMethodListItemProps {
  item: PaymentMethod;
  isSelected: boolean;
  isMutating: boolean;
  onSelect: (item: PaymentMethod) => void;
  onDelete: (item: PaymentMethod) => void;
}

const CheckoutPaymentMethodListItem: React.FC<
  CheckoutPaymentMethodListItemProps
> = ({ item, isSelected, isMutating, onSelect, onDelete }) => {
  const { t } = useTranslation();

  const containerStyles = [
    styles.container,
    isSelected && styles.selectedContainer,
    isMutating && styles.mutatingContainer,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={() => onSelect(item)}
      disabled={isMutating}
      activeOpacity={0.7}
    >
      <BrandIcon brand={item.brand as BrandName} width={moderateScale(38)} />
      <View style={styles.detailsContainer}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>
            {item.brand} •••• {item.last4}
          </Text>
          {item.isDefault && (
            <CheckCircleIcon
              size={moderateScale(16)}
              color={isSelected ? COLORS.accent : COLORS.secondaryText}
              weight="fill"
              style={styles.checkIcon}
            />
          )}
        </View>
        <Text style={styles.expiryText}>
          {t('payments:expiresOn')} {String(item.expMonth).padStart(2, '0')}/
          {item.expYear}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        {isMutating ? (
          <LoadingIndicator size="small" />
        ) : (
          <TouchableOpacity
            onPress={(e) => {
              //  WE ADDED stopPropagation TO AVOID CONFLICTS
              e.stopPropagation();
              onDelete(item);
            }}
            style={styles.actionButton}
          >
            <TrashIcon size={moderateScale(22)} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: 12,
    marginBottom: verticalScale(12),
    borderWidth: 1.5,
    borderColor: COLORS.separator,
    backgroundColor: COLORS.white,
  },

  selectedContainer: {
    borderColor: COLORS.orderProcessing,
    backgroundColor: COLORS.warningBackground,
  },
  mutatingContainer: {
    opacity: 0.6,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: scale(16),
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  brandText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  checkIcon: {
    marginLeft: scale(8),
  },
  expiryText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: moderateScale(40),
  },
  actionButton: {
    padding: scale(8),
  },
});

export default CheckoutPaymentMethodListItem;
