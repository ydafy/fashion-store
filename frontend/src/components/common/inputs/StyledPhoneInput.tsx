import React, { useRef } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import PhoneInput from 'react-native-phone-number-input';

import { Country } from 'react-native-country-picker-modal';
import { COLORS } from '../../../constants/colors';
import { moderateScale, verticalScale } from '../../../utils/scaling';
interface StyledPhoneInputProps {
  label: string;
  value: {
    number: string;
    countryCode: string;
    callingCode: string;
    isValid: boolean;
  };
  onChange: (value: {
    number: string;
    countryCode: string;
    callingCode: string;
    isValid: boolean;
  }) => void;
  onBlur: () => void;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
const StyledPhoneInput: React.FC<StyledPhoneInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  errorMessage,
  containerStyle,
}) => {
  const { t, i18n } = useTranslation(['header']);

  const countryPickerLanguage = i18n.language === 'es' ? 'spa' : 'common';
  const phoneInputRef = useRef<PhoneInput>(null);

  const handleTextChange = (text: string) => {
    const isValid =
      phoneInputRef.current?.isValidNumber(`+${value.callingCode}${text}`) ||
      false;

    onChange({
      ...value,
      number: text,
      isValid: isValid,
    });
  };
  const handleCountryChange = (country: Country) => {
    onChange({
      ...value,
      countryCode: country.cca2,
      callingCode: country.callingCode[0] || '',
    });
  };
  return (
    <View style={[styles.outerContainer, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <PhoneInput
        ref={phoneInputRef}
        key={i18n.language}
        defaultValue={value.number}
        defaultCode={(value.countryCode as any) || 'US'}
        layout="first"
        onChangeText={handleTextChange}
        onChangeCountry={handleCountryChange}
        textInputProps={{ onBlur: onBlur }}
        containerStyle={[
          styles.inputContainer,
          errorMessage ? styles.errorBorder : null,
        ]}
        textContainerStyle={styles.textContainer}
        codeTextStyle={styles.codeText}
        textInputStyle={styles.inputText}
        flagButtonStyle={styles.flagButton}
        autoFocus
        countryPickerProps={{
          withAlphaFilter: true,
          translation: countryPickerLanguage,
          preferredCountries: ['US', 'MX', 'ES'],
          filterProps: {
            placeholder: t('common:countryPickerPlaceholder'),
          },
        }}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    marginBottom: verticalScale(8),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  inputContainer: {
    width: '100%',
    height: moderateScale(55),
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.primaryBackground,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  // eslint-disable-next-line react-native/no-color-literals
  textContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    borderTopRightRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
  },
  codeText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(16),
  },
  inputText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(16),
    height: moderateScale(55),
  },
  flagButton: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderDefault,
  },
  errorText: {
    color: COLORS.error,
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
  },
});
export default StyledPhoneInput;
