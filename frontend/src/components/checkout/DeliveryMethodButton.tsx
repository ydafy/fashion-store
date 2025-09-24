import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface DeliveryMethodButtonProps {
  icon: React.ReactElement; // We receive the complete icon component
  text: string;
  isSelected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const DeliveryMethodButton: React.FC<DeliveryMethodButtonProps> = ({
  icon,
  text,
  isSelected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        isSelected && styles.selectedButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={text}
    >
      <View style={styles.content}>
        {/*  We render the icon directly into its container */}
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(15),
    marginBottom: moderateScale(12),
    backgroundColor: COLORS.white,
  },
  // eslint-disable-next-line react-native/no-color-literals
  selectedButton: {
    borderColor: COLORS.orderProcessing,
    backgroundColor: '#e9e7e2',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrapper: {
    marginRight: moderateScale(12),
  },
  text: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  selectedText: {
    color: COLORS.primaryText,
  },
});

export default DeliveryMethodButton;
