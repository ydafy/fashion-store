import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../../constants/colors';
import { moderateScale } from '../../../utils/scaling';

interface StyledPickerProps extends Omit<PickerSelectProps, 'onValueChange'> {
  /**
   * Etiqueta que se muestra encima del picker.
   */
  label: string;
  /**
   * Mensaje de error a mostrar debajo del picker.
   */
  errorMessage?: string;
  /**
   * Función que se llama cuando el valor del picker cambia.
   */
  onValueChange: (value: any) => void;
  /**
   * El texto que se muestra como placeholder cuando no hay nada seleccionado.
   */
  placeholder: string;
}

const StyledPicker: React.FC<StyledPickerProps> = ({
  label,
  errorMessage,
  onValueChange,
  items,
  value,
  placeholder,
  disabled = false,
  ...restOfProps
}) => {
  const { t } = useTranslation();

  // Estilos dinámicos para el borde, igual que en StyledTextInput
  const getDynamicBorderStyle = () => {
    if (errorMessage) return { borderColor: COLORS.error, borderWidth: 1.5 };
    return { borderColor: COLORS.borderDefault, borderWidth: 1 };
  };

  const pickerPlaceholder = {
    label: placeholder,
    value: null,
    color: COLORS.secondaryText
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={value}
        placeholder={pickerPlaceholder}
        disabled={disabled}
        useNativeAndroidPickerStyle={false}
        style={{
          inputIOS: {
            ...styles.inputBase,
            ...getDynamicBorderStyle()
          },
          inputAndroid: {
            ...styles.inputBase,
            ...getDynamicBorderStyle()
          },
          iconContainer: styles.iconContainer,
          placeholder: {
            color: COLORS.secondaryText
          }
        }}
        Icon={() => (
          <Ionicons
            name="chevron-down"
            size={moderateScale(20)}
            color={COLORS.secondaryText}
          />
        )}
        {...restOfProps}
      />
      {/* Contenedor de error con altura fija para evitar saltos de layout */}
      <View style={styles.errorContainer}>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: moderateScale(5) // Un poco menos de margen porque el errorContainer ya da espacio
  },
  label: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(8)
  },
  inputBase: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    paddingVertical:
      Platform.OS === 'ios' ? moderateScale(14) : moderateScale(11),
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    paddingRight: moderateScale(35) // Espacio para el icono
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? moderateScale(14) : moderateScale(16),
    right: moderateScale(15)
  },
  errorContainer: {
    minHeight: moderateScale(18),
    marginTop: moderateScale(6),
    paddingHorizontal: moderateScale(2)
  },
  errorText: {
    color: COLORS.error,
    fontSize: moderateScale(12),
    fontFamily: 'FacultyGlyphic-Regular'
  }
});

export default StyledPicker;
