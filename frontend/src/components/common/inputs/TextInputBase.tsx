import React, { forwardRef, ReactElement, useMemo, useState } from 'react';
import {
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  StyleProp,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { COLORS } from '../../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../../utils/scaling';

export interface TextInputBaseProps extends TextInputProps {
  hasError?: boolean;
  isFocused?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: ReactElement;
  render?: (props: TextInputProps) => React.ReactElement;
}

const TextInputBase = forwardRef<TextInput, TextInputBaseProps>(
  (
    {
      hasError,
      isFocused,
      style,
      render,
      containerStyle,
      rightIcon,
      ...restOfProps
    },
    ref,
  ) => {
    const borderColor = useMemo(() => {
      if (isFocused) return COLORS.accent;
      if (hasError) return COLORS.error;
      return COLORS.borderDefault;
    }, [isFocused, hasError]);
    const textInputProps = {
      ref,
      style: [styles.inputBase, rightIcon ? styles.inputWithIcon : {}, style],
      placeholderTextColor: COLORS.secondaryText,
      ...restOfProps,
    };

    return (
      <View style={[styles.fieldContainer, { borderColor }, containerStyle]}>
        {/* ✨ LÓGICA CONDICIONAL: Usa la función 'render' si existe, si no, el TextInput por defecto */}
        {render ? render(textInputProps) : <TextInput {...textInputProps} />}

        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(8),
    borderWidth: 1.5,
    width: '100%',
  },
  inputBase: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  inputWithIcon: { paddingRight: scale(45) },
  rightIconContainer: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: scale(12),
  },
});

export default TextInputBase;
