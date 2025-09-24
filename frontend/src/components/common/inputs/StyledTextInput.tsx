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
      onFocus: propOnFocus, // We receive the onFocus from outside
      onBlur: propOnBlur, // We receive the onBlur from outside
      ...restOfProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useLocalState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      propOnFocus?.(e); // We execute the onFocus function that was passed to us
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      propOnBlur?.(e); // We execute the onBlur function that was passed to us
    };

    return (
      <View style={[styles.inputWrapper, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TextInputBase
          ref={ref}
          isFocused={isFocused}
          hasError={!!errorMessage}
          // We connect our handlers that DO call the external props.
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
