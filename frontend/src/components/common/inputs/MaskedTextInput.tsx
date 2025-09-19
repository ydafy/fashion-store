import React, { forwardRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  StyleProp,
  ViewStyle,
} from 'react-native';
import MaskInput, { MaskInputProps } from 'react-native-mask-input';

import { COLORS } from '../../../constants/colors';
import { moderateScale, verticalScale, scale } from '../../../utils/scaling';

// ✨ 1. DEFINIMOS LAS PROPS
// Heredamos las props de la librería y añadimos las nuestras.
export interface MaskedTextInputProps extends MaskInputProps {
  label?: string;
  errorMessage?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
}

const MaskedTextInput = forwardRef<TextInput, MaskedTextInputProps>(
  (
    {
      label,
      errorMessage,
      containerStyle,
      onFocus: propOnFocus,
      onBlur: propOnBlur,
      ...restOfProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      propOnFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      propOnBlur?.(e);
    };

    // Lógica para el color del borde, igual que en StyledTextInput
    const borderColor = useMemo(() => {
      if (isFocused) return COLORS.accent;
      if (errorMessage) return COLORS.error;
      return COLORS.borderDefault;
    }, [isFocused, errorMessage]);

    return (
      <View style={[styles.inputWrapper, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        {/* ✨ 2. USAMOS MASKINPUT COMO EL NÚCLEO */}
        <View style={[styles.fieldContainer, { borderColor }]}>
          <MaskInput
            ref={ref}
            style={styles.inputBase}
            placeholderTextColor={COLORS.secondaryText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...restOfProps}
          />
        </View>

        <View style={styles.errorContainer}>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      </View>
    );
  },
);

// ✨ 3. USAMOS LOS MISMOS ESTILOS QUE STYLEDTEXTINPUT PARA CONSISTENCIA
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
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(8),
    borderWidth: 1.5,
  },
  inputBase: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
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

export default MaskedTextInput;
