import React, { forwardRef, useState as useLocalState } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';

import { moderateScale, scale, verticalScale } from '../../../utils/scaling';
import TextInputBase, { TextInputBaseProps } from './TextInputBase';
import { COLORS } from '../../../constants/colors';

export interface StyledTextInputProps extends TextInputBaseProps {
  label?: string;
  errorMessage?: string | null;
}

const StyledTextInput = forwardRef<TextInput, StyledTextInputProps>(
  (
    {
      label,
      errorMessage,
      containerStyle,
      onFocus: propOnFocus, // Recibimos el onFocus del exterior
      onBlur: propOnBlur, // Recibimos el onBlur del exterior
      ...restOfProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useLocalState(false);

    // ✨ ESTA ES LA LÓGICA CORRECTA ✨
    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      propOnFocus?.(e); // Ejecutamos la función onFocus que nos pasaron
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      propOnBlur?.(e); // Ejecutamos la función onBlur que nos pasaron
    };

    return (
      <View style={[styles.inputWrapper, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TextInputBase
          ref={ref}
          isFocused={isFocused}
          hasError={!!errorMessage}
          // ✨ AQUÍ ESTÁ LA CORRECCIÓN CLAVE ✨
          // Conectamos nuestros handlers que SÍ llaman a las props externas.
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restOfProps}
        />

        <View style={styles.errorContainer}>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      </View>
    );
  },
);

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(8),
  },
  errorContainer: {
    minHeight: verticalScale(18),
    marginTop: verticalScale(3),
    paddingHorizontal: scale(2),
  },
  errorText: {
    color: COLORS.error,
    fontSize: moderateScale(12),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default StyledTextInput;
