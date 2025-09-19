import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
// ✨ CAMBIO: Importamos nuestro IconFactory en lugar de Ionicons.
import { IconFactory } from '../icons/IconFactory';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onPress: () => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconSize?: number;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  isChecked,
  onPress,
  disabled = false,
  containerStyle,
  labelStyle,
  iconSize = 26,
}) => {
  const stateStyles = {
    iconColor: disabled ? COLORS.borderDefault : COLORS.primaryText,
    labelColor: disabled ? COLORS.secondaryText : COLORS.primaryText,
    containerOpacity: disabled ? 0.6 : 1,
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { opacity: stateStyles.containerOpacity },
        containerStyle,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: isChecked,
        disabled: disabled,
      }}
      accessibilityLabel={label}
    >
      {/* ✨ CAMBIO: Usamos IconFactory con iconos de Phosphor. */}
      <IconFactory
        name={isChecked ? 'Check' : 'Square'}
        weight={isChecked ? 'fill' : 'regular'}
        size={moderateScale(iconSize)}
        color={stateStyles.iconColor}
      />
      <Text
        style={[styles.label, { color: stateStyles.labelColor }, labelStyle]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
  },
  label: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    flexShrink: 1,
  },
});

export default Checkbox;
