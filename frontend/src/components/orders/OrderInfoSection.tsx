import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Order } from '../../types/order';
import { COLORS } from '../../constants/colors';
import { formatDisplayDate } from '../../utils/formatters'; // ✨ Usamos el formatter estándar
import {
  statusDisplayMap,
  statusStyleMap,
  statusIconMap,
} from '../../utils/orderUtils';
import { moderateScale } from '../../utils/scaling';
import { IconFactory } from '../icons/IconFactory';

// --- ✨ 3. Creación de un Sub-Componente Reutilizable `InfoRow` ✨ ---
interface InfoRowProps {
  label: string;
  value: React.ReactNode; // Acepta texto o componentes (como el de estado con icono)
  isStatus?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  isStatus = false,
}) => (
  <View
    style={[styles.infoRow, isStatus && styles.statusRowAlignment]}
    // ✨ 5. Accesibilidad ✨
    accessibilityRole="text"
    accessibilityLabel={`${label} ${typeof value === 'string' ? value : ''}`}
  >
    <Text style={styles.infoLabel}>{label}</Text>
    {typeof value === 'string' ? (
      <Text style={styles.infoValue}>{value}</Text>
    ) : (
      value
    )}
  </View>
);

// --- Componente Principal ---
interface OrderInfoSectionProps {
  order: Order;
}

const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({ order }) => {
  console.log(
    '[OrderInfoSection] Recibiendo order.status:',
    order.status,
    ' | Tipo:',
    typeof order.status,
  );
  const { t } = useTranslation();

  // --- ✨ 1. Lógica de Internacionalización y Formato ✨ ---
  const statusKey = statusDisplayMap[order.status] || statusDisplayMap.unknown;
  const statusText = t(statusKey);
  const specificStatusStyle =
    statusStyleMap[order.status] || statusStyleMap.unknown;
  const iconName = statusIconMap[order.status] || statusIconMap.unknown;
  const iconColor =
    (specificStatusStyle?.color as string) || COLORS.secondaryText;

  const shippingMethodText = t(
    order.shippingMethod === 'delivery'
      ? 'orders:shippingMethod.delivery'
      : 'orders:shippingMethod.pickup',
  );

  // Componente para el valor del estado, para pasarlo a InfoRow
  const StatusValue = (
    <View style={styles.statusValueContainer}>
      <IconFactory
        name={iconName}
        size={moderateScale(18)}
        color={iconColor}
        weight="regular"
        //style={styles.statusIcon}
      />
      <Text
        style={[styles.infoValue, styles.statusValueText, specificStatusStyle]}
      >
        {statusText}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{t('orders:infoSection.title')}</Text>

        {/* ✨ 3. Usamos nuestro componente InfoRow para un JSX más limpio ✨ */}
        <InfoRow
          label={t('orders:infoSection.orderIdLabel')}
          value={`#${order.id.substring(0, 12)}...`}
        />
        <InfoRow
          label={t('orders:infoSection.dateLabel')}
          value={formatDisplayDate(order.createdAt)}
        />
        <InfoRow
          label={t('orders:infoSection.statusLabel')}
          value={StatusValue}
          isStatus
        />
        <InfoRow
          label={t('orders:infoSection.shippingMethodLabel')}
          value={shippingMethodText}
        />
      </View>
    </View>
  );
};

// --- ✨ 4. Estilos Refinados y Responsivos ✨ ---
const styles = StyleSheet.create({
  container: {
    padding: moderateScale(15), // Añadimos el padding aquí
  },
  content: {
    // El contenido ya no necesita padding extra
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(15),
    paddingBottom: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  infoLabel: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginRight: moderateScale(10),
  },
  infoValue: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },

  statusValueText: {
    textAlign: 'left',
  },
  statusRowAlignment: {
    alignItems: 'center',
  },
});

export default OrderInfoSection;
