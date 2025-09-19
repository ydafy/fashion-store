import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TrashIcon, CheckCircleIcon } from 'phosphor-react-native';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { PaymentMethod } from '../../types/payment';
import LoadingIndicator from '../common/LoadingIndicator';
import BrandIcon from '../common/BrandIcon';
import { BrandName } from '../common/BrandIcon'; // Importamos el tipo también

interface PaymentMethodListItemProps {
  item: PaymentMethod;
  onSetDefault: (item: PaymentMethod) => void;
  onDelete: (item: PaymentMethod) => void;
  isMutating: boolean;
}

const PaymentMethodListItem: React.FC<PaymentMethodListItemProps> = ({
  item,
  onSetDefault,
  onDelete,
  isMutating,
}) => {
  const { t } = useTranslation();

  // ✨ 1. CONSTRUIMOS UN LABEL DE ACCESIBILIDAD DESCRIPTIVO ✨
  const accessibilityLabel = `${item.brand} ${t('payments:cardEndingIn')} ${
    item.last4
  }. ${t('payments:expiresOn')} ${item.expMonth}/${item.expYear}. ${
    item.isDefault ? t('payments:isDefault') : ''
  }`;

  const containerStyles = [
    styles.container,
    item.isDefault && styles.defaultContainer,
    isMutating && styles.mutatingContainer,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={() => onSetDefault(item)}
      disabled={isMutating || item.isDefault}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isMutating || item.isDefault }}
    >
      <BrandIcon
        brand={item.brand as BrandName} // Hacemos un type assertion por si los tipos no coinciden 100%
        width={moderateScale(38)}
      />

      <View style={styles.detailsContainer}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandText}>
            {item.brand} •••• {item.last4}
          </Text>
          {item.isDefault && (
            <CheckCircleIcon
              size={moderateScale(16)}
              color={COLORS.primaryText}
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
              // ✨ 2. DETENEMOS LA PROPAGACIÓN DEL EVENTO ✨
              e.stopPropagation();
              onDelete(item);
            }}
            style={styles.actionButton}
            accessibilityRole="button"
            accessibilityLabel={`${t('common:delete')} ${item.brand} ${t(
              'payments:cardEndingIn',
            )} ${item.last4}`}
          >
            <TrashIcon size={moderateScale(22)} color={COLORS.orderCancelled} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ✨ 3. ESTILOS REFINADOS PARA ALINEARSE CON ADDRESSLISTITEM ✨
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
  defaultContainer: {
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

export default PaymentMethodListItem;
