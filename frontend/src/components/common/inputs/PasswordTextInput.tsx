import React, { useState, forwardRef } from 'react';
import { TouchableOpacity, TextInput } from 'react-native';
import { EyeIcon, EyeSlashIcon } from 'phosphor-react-native';

import StyledTextInput, { StyledTextInputProps } from './StyledTextInput';
import { COLORS } from '../../../constants/colors';
import { moderateScale } from '../../../utils/scaling';

const PasswordTextInput = forwardRef<TextInput, StyledTextInputProps>(
  (props, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    return (
      <StyledTextInput
        ref={ref}
        secureTextEntry={!isPasswordVisible}
        {...props} // Pasamos todas las demás props al StyledTextInput
        rightIcon={
          <TouchableOpacity onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <EyeSlashIcon
                size={moderateScale(24)}
                color={COLORS.secondaryText}
              />
            ) : (
              <EyeIcon size={moderateScale(24)} color={COLORS.secondaryText} />
            )}
          </TouchableOpacity>
        }
      />
    );
  },
);

export default PasswordTextInput;
