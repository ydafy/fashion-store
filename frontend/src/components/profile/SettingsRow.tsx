import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CaretRightIcon } from 'phosphor-react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface SettingsRowProps {
  /**
   * La etiqueta principal que se muestra a la izquierda.
   */
  label: string;
  /**
   * El contenido que se muestra a la derecha. Puede ser un string o un componente.
   * Si es 'null', se mostrará un icono de chevron por defecto.
   */
  value?: React.ReactNode | string | null;
  /**
   * Función que se ejecuta al presionar la fila.
   */
  onPress: () => void;
  /**
   * Si es 'true', no se mostrará el borde inferior. Útil para la última fila de una sección.
   */
  isLast?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  value = null, // Por defecto, es un enlace de navegación
  onPress,
  isLast = false,
}) => {
  const renderValue = () => {
    // Si el valor es null, mostramos el icono de chevron para indicar navegación.
    if (value === null) {
      return (
        <CaretRightIcon size={moderateScale(20)} color={COLORS.secondaryText} />
      );
    }
    // Si el valor es un string, lo renderizamos en un componente Text.
    if (typeof value === 'string') {
      return <Text style={styles.valueText}>{value}</Text>;
    }
    // Si es cualquier otra cosa (un icono, un switch, etc.), lo renderizamos directamente.
    return value;
  };

  return (
    <TouchableOpacity
      style={[styles.container, isLast && styles.noBorder]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${typeof value === 'string' ? value : ''}`}
    >
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.valueContainer}>{renderValue()}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
    backgroundColor: COLORS.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  labelText: {
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginRight: scale(8), // Espacio por si hay un chevron al lado
  },
});

export default SettingsRow;
