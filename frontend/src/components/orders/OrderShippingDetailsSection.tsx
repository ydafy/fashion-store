import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { ArrowCircleRightIcon } from 'phosphor-react-native';

import { Order } from '../../types/order';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

// --- ✨ 2. Reutilizamos el sub-componente InfoRow (puedes moverlo a un archivo común si lo usas mucho) ✨ ---
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.infoRow} accessibilityLabel={`${label} ${value}`}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

interface OrderShippingDetailsSectionProps {
  order: Order;
}

const OrderShippingDetailsSection: React.FC<
  OrderShippingDetailsSectionProps
> = ({ order }) => {
  const { t } = useTranslation();

  const canShowTracking =
    order.shippingMethod === 'delivery' &&
    (order.status === 'shipped' || order.status === 'delivered') &&
    (order.trackingNumber || order.trackingUrl);

  const handleTrackPackage = async () => {
    let url = order.trackingUrl;
    if (!url && order.shippingProvider && order.trackingNumber) {
      const provider = order.shippingProvider.toLowerCase();
      if (provider.includes('dhl'))
        url = `https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`;
      else if (provider.includes('fedex'))
        url = `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`;
    }

    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Toast.show({
          type: 'error',
          text1: t('orders:shippingSection.errors.cantOpenUrlTitle'),
          text2: t('orders:shippingSection.errors.cantOpenUrlMessage', { url }),
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text1: t('orders:shippingSection.errors.noUrlTitle'),
        text2: t('orders:shippingSection.errors.noUrlMessage'),
      });
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>
        {t(
          order.shippingMethod === 'delivery'
            ? 'orders:shippingSection.deliveryTitle'
            : 'orders:shippingSection.pickupTitle',
        )}
      </Text>

      {/* --- ✨ 1. Textos Internacionalizados y Estructura Limpia ✨ --- */}
      {order.shippingMethod === 'delivery' && order.shippingAddress && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressTextBold}>
            {order.shippingAddress.recipientName}
          </Text>
          <Text style={styles.addressText}>{`${order.shippingAddress.street}${
            order.shippingAddress.details
              ? `, ${order.shippingAddress.details}`
              : ''
          }`}</Text>
          <Text
            style={styles.addressText}
          >{`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress.country}
          </Text>
          {order.shippingAddress.phone && (
            <Text style={styles.addressText}>{`${t(
              'orders:shippingSection.phoneLabel',
            )}: ${order.shippingAddress.phone}`}</Text>
          )}
          {order.shippingAddress.instructions && (
            <Text style={[styles.addressText, styles.instructionsText]}>{`${t(
              'orders:shippingSection.instructionsLabel',
            )}: ${order.shippingAddress.instructions}`}</Text>
          )}
        </View>
      )}

      {order.shippingMethod === 'pickup' && order.pickupLocation && (
        <>
          <View style={styles.addressContainer}>
            <Text style={styles.addressTextBold}>
              {order.pickupLocation.name}
            </Text>
            <Text style={styles.addressText}>
              {order.pickupLocation.address}
            </Text>
            {order.pickupLocation.hours && (
              <Text style={styles.addressText}>{`${t(
                'orders.shippingSection.hoursLabel',
              )}: ${order.pickupLocation.hours}`}</Text>
            )}
          </View>
          {order.pickupContact && (
            <View style={styles.detailBlock}>
              <Text style={styles.detailBlockTitle}>
                {t('orders:shippingSection.pickupContactTitle')}
              </Text>
              <InfoRow
                label={t('orders:shippingSection.contactNameLabel')}
                value={order.pickupContact.name}
              />
              <InfoRow
                label={t('orders:shippingSection.contactEmailLabel')}
                value={order.pickupContact.email}
              />
              <InfoRow
                label={t('orders:shippingSection.contactPhoneLabel')}
                value={order.pickupContact.phone}
              />
            </View>
          )}
        </>
      )}

      {canShowTracking && (
        <View style={styles.detailBlock}>
          <Text style={styles.detailBlockTitle}>
            {t('orders:shippingSection.trackingTitle')}
          </Text>
          {order.shippingProvider && (
            <InfoRow
              label={t('orders:shippingSection.providerLabel')}
              value={order.shippingProvider}
            />
          )}
          {order.trackingNumber && (
            <InfoRow
              label={t('orders:shippingSection.trackingNumberLabel')}
              value={order.trackingNumber}
            />
          )}
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackPackage}
            accessibilityRole="button"
            accessibilityLabel={t('orders:shippingSection.trackButton')}
          >
            <ArrowCircleRightIcon
              size={moderateScale(22)}
              weight="regular"
              color={COLORS.white}
              style={styles.trackButtonIcon}
            />
            <Text style={styles.trackButtonText}>
              {t('orders:shippingSection.trackButton')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- ✨ Estilos ✨ ---
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(15),
  },
  addressContainer: {
    paddingBottom: moderateScale(10),
  },
  addressText: {
    fontSize: moderateScale(13),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(4),
    lineHeight: moderateScale(22),
  },
  addressTextBold: {
    fontSize: moderateScale(15),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  instructionsText: {
    fontStyle: 'italic',
    color: COLORS.secondaryText,
    marginTop: moderateScale(4),
  },
  detailBlock: {
    marginTop: moderateScale(15),
    paddingTop: moderateScale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  detailBlockTitle: {
    fontSize: moderateScale(20),
    fontWeight: '500',
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(10),
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  infoLabel: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  infoValue: {
    fontSize: moderateScale(15),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
    textAlign: 'right',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryText,
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(10),
  },
  trackButtonIcon: {
    marginRight: moderateScale(8),
  },
  trackButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default OrderShippingDetailsSection;
