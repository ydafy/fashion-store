import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

// --- ✨ 1. Importaciones Clave ✨ ---
import { Image as ExpoImage } from 'expo-image';
import { Order } from '../../types/order';
import { COLORS } from '../../constants/colors';
import { formatCurrency, formatDisplayDate } from '../../utils/formatters';
import {
  statusDisplayMap,
  statusStyleMap,
  statusIconMap,
} from '../../utils/orderUtils';
import { moderateScale } from '../../utils/scaling';
import { IconFactory } from '../icons/IconFactory';
import { ArrowRightIcon } from 'phosphor-react-native'; // Un icono más moderno para "ver detalles"

interface OrderListItemProps {
  order: Order;
  onPress: () => void;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order, onPress }) => {
  const { t } = useTranslation();

  // --- ✨ 2. Lógica de Datos y Traducción ✨ ---
  const firstItem = order.items.length > 0 ? order.items[0] : null;
  const statusKey = statusDisplayMap[order.status] || 'orders.status.unknown';
  const statusText = t(statusKey);
  const specificStatusStyle = statusStyleMap[order.status];
  const iconName = statusIconMap[order.status] || statusIconMap.unknown;
  const iconColor =
    (specificStatusStyle?.color as string) || COLORS.secondaryText;

  // --- ✨ 5. Accesibilidad ✨ ---
  const accessibilityLabel = t('orders:listItem.accessibilityLabel', {
    orderId: order.id.substring(0, 8),
    date: formatDisplayDate(order.createdAt),
    total: formatCurrency(order.totalAmount),
    status: statusText,
    itemCount: order.items.length,
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.orderId}>
          {t('orders:listItem.orderIdLabel', { id: order.id.substring(0, 8) })}
        </Text>
        <Text style={styles.date}>{formatDisplayDate(order.createdAt)}</Text>
      </View>

      {/* --- Contenido Principal --- */}
      <View style={styles.content}>
        {firstItem && (
          // ✨ 2. Usamos ExpoImage ✨
          <ExpoImage
            source={{ uri: firstItem.image }}
            style={styles.itemImage}
            placeholder={firstItem.blurhash || 'L6PZfSi_.AyE_3t7t7Rj~qofbHof'}
            contentFit="cover"
            transition={300}
          />
        )}
        <View style={styles.details}>
          <Text style={styles.totalAmount}>
            {/* ✨ 3. Formato de Moneda ✨ */}
            {`${t('orders:listItem.totalLabel')}: ${formatCurrency(
              order.totalAmount,
            )}`}
          </Text>
          <View style={styles.statusContainer}>
            <IconFactory
              name={iconName}
              size={moderateScale(18)}
              color={iconColor}
              weight="regular"
            />
            <Text style={[styles.statusText, specificStatusStyle]}>
              {statusText}
            </Text>
          </View>
          <Text style={styles.itemCount}>
            {t('orders:listItem.itemCount', { count: order.items.length })}
          </Text>
        </View>
      </View>

      {/* --- Footer --- */}
      <View style={styles.footer}>
        <Text style={styles.viewDetailsText}>
          {t('orders:listItem.viewDetails')}
        </Text>
        <ArrowRightIcon
          size={moderateScale(20)}
          color={COLORS.accent}
          weight="regular"
        />
      </View>
    </TouchableOpacity>
  );
};

// --- ✨ 4. Estilos Refinados y Responsivos ✨ ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryBackground,
    borderRadius: moderateScale(12),
    padding: moderateScale(15),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: COLORS.separator,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(12),
    paddingBottom: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  orderId: {
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '600',
  },
  date: {
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: moderateScale(80),
    height: moderateScale(120),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(15),
    backgroundColor: COLORS.primaryBackground,
  },
  details: {
    flex: 1,
  },
  totalAmount: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '500',
    marginBottom: moderateScale(6),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },

  statusText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
  },
  itemCount: {
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: moderateScale(12),
    marginTop: moderateScale(8),
  },
  viewDetailsText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.accent,
    fontWeight: '600',
    marginRight: moderateScale(5),
  },
});

export default OrderListItem;
