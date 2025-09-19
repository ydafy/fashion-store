import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface OrderCostSummarySectionProps {
  subtotal: number;
  shippingCost: number;
  /**
   * Monto de los impuestos. Si no se proporciona o es 0, no se muestra la fila.
   */
  taxAmount?: number;
  totalAmount: number;
}

const OrderCostSummarySection: React.FC<OrderCostSummarySectionProps> = ({
  subtotal,
  shippingCost,
  taxAmount,
  totalAmount
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('orderSummary:title')}</Text>

      {/* Fila de Subtotal */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          {t('orderSummary:subtotalLabel')}
        </Text>
        <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
      </View>

      {/* Fila de Envío */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          {t('orderSummary:shippingLabel')}
        </Text>
        <Text style={styles.summaryValue}>
          {shippingCost > 0 ? formatCurrency(shippingCost) : t('common:free')}
        </Text>
      </View>

      {/* ✨ Fila de Impuestos (se renderiza condicionalmente) ✨ */}
      {taxAmount && taxAmount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('orderSummary:taxLabel')}</Text>
          <Text style={styles.summaryValue}>{formatCurrency(taxAmount)}</Text>
        </View>
      )}

      {/* Fila de Total */}
      <View style={[styles.summaryRow, styles.summaryTotalRow]}>
        <Text style={styles.summaryLabelTotal}>
          {t('orderSummary:totalLabel')}
        </Text>
        <Text style={styles.summaryValueTotal}>
          {formatCurrency(totalAmount)}
        </Text>
      </View>
    </View>
  );
};

// ✨ Estilos refinados con `moderateScale`
const styles = StyleSheet.create({
  sectionContainer: {
    padding: moderateScale(15)
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '500',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(15),
    paddingBottom: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(6)
  },
  summaryLabel: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular'
  },
  summaryValue: {
    fontSize: moderateScale(15),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500'
  },
  summaryTotalRow: {
    borderTopWidth: 1.5, // Un poco más grueso para el total
    borderTopColor: COLORS.primaryText,
    marginTop: moderateScale(10),
    paddingTop: moderateScale(10)
  },
  summaryLabelTotal: {
    fontSize: moderateScale(17),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600'
  },
  summaryValueTotal: {
    fontSize: moderateScale(17),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600'
  }
});

export default OrderCostSummarySection;
