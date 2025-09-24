import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// --- Types and Components ---
import { Address } from '../../types/address';
import EmptyState from '../common/EmptyState';
import { IconFactory } from '../icons/IconFactory';

// --- Constants and Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

interface ShippingDetailsPreviewProps {
  address: Address | null | undefined;
}

const ShippingDetailsPreview: React.FC<ShippingDetailsPreviewProps> = ({
  address,
}) => {
  const { t } = useTranslation('address');

  //  We render the empty state if no direction is selected.
  if (!address) {
    return (
      <EmptyState
        message={t('noAddressSelected')}
        subtext={t('noAddressSelectedSubtext')}
        icon={
          <IconFactory
            name="MapPinIcon"
            color={COLORS.secondaryText}
            size={moderateScale(40)}
            weight="light"
          />
        }
        style={styles.emptyStateContainer}
      />
    );
  }

  //  We render the full address details if one exists.
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{address.label}</Text>
      <Text style={styles.addressLine}>{address.street}</Text>
      <Text style={styles.addressLine}>
        {`${address.city}, ${address.state}, ${address.postalCode}`}
      </Text>
      <Text style={styles.addressLine}>{address.country}</Text>

      {/* We only show delivery instructions if they exist */}
      {address.instructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsLabel}>
            {t('deliveryInstructionsLabel')}
          </Text>
          <Text style={styles.instructionsText}>{address.instructions}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(16),
  },
  label: {
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  addressLine: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    lineHeight: moderateScale(22),
  },
  instructionsContainer: {
    marginTop: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  instructionsLabel: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: verticalScale(6),
  },
  instructionsText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    lineHeight: moderateScale(20),
  },
  emptyStateContainer: {
    minHeight: verticalScale(200),
  },
});

export default ShippingDetailsPreview;
