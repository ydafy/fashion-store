import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { formatCurrency } from '../../utils/formatters';

interface PriceRangeFilterProps {
  minLimit: number;
  maxLimit: number;
  currentMinValue: number;
  currentMaxValue: number;
  onValuesChange: (values: [number, number]) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minLimit,
  maxLimit,
  currentMinValue,
  currentMaxValue,
  onValuesChange
}) => {
  const { t, i18n } = useTranslation();

  // Si el rango es 0 (ej. solo hay un producto), deshabilitamos el slider.
  if (maxLimit - minLimit <= 0) {
    return null; // O mostrar un texto indicando el precio único
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('shop:filters.priceRangeTitle')}</Text>
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>
          {formatCurrency(currentMinValue, i18n.language, 'USD')}
        </Text>
        <Text style={styles.label}>
          {formatCurrency(currentMaxValue, i18n.language, 'USD')}
        </Text>
      </View>
      <View style={styles.sliderContainer}>
        <MultiSlider
          values={[currentMinValue, currentMaxValue]}
          min={minLimit}
          max={maxLimit}
          onValuesChangeFinish={(values) =>
            onValuesChange(values as [number, number])
          }
          step={1} // El usuario puede seleccionar cualquier valor entero
          allowOverlap={false}
          snapped={false}
          sliderLength={scale(280)} // Ajusta el ancho del slider
          containerStyle={styles.sliderComponentContainer}
          trackStyle={styles.track}
          selectedStyle={styles.selectedTrack}
          markerStyle={styles.marker}
          pressedMarkerStyle={styles.pressedMarker}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    marginTop: verticalScale(10)
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(15)
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10)
  },
  label: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular'
  },
  sliderContainer: {
    alignItems: 'center' // Centra el slider en el contenedor
  },
  sliderComponentContainer: {
    height: verticalScale(30)
  },
  track: {
    backgroundColor: COLORS.lightGray,
    height: verticalScale(4),
    borderRadius: 2
  },
  selectedTrack: {
    backgroundColor: COLORS.primaryText
  },
  marker: {
    backgroundColor: COLORS.white,
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primaryText,
    // Sombra para un look más premium
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3
  },
  pressedMarker: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: 14
  }
});

export default PriceRangeFilter;
