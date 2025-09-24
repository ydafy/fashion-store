import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface AuthButtonProps {
  title?: string; // We make 'title' optional for backwards compatibility
  children?: React.ReactNode; // 'children' can be anything that React can render
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  icon?: React.ReactElement;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  children,
  onPress,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  icon,
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.primaryBackground} />
      ) : (
        // RENDERING LOGIC: If we are passed 'children', we render them.
        // If not, we render the 'title' as before so as not to break other components.
        children || (
          <View style={styles.contentWrapper}>
            {icon && <View style={styles.iconWrapper}>{icon}</View>}
            <Text
              style={[
                styles.text,
                textStyle,
                isDisabled && styles.textDisabled,
              ]}
            >
              {title}
            </Text>
          </View>
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: verticalScale(50),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  buttonDisabled: {
    backgroundColor: COLORS.secondaryText,
    opacity: 0.7,
  },

  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    marginRight: scale(8),
  },
  text: {
    color: COLORS.primaryBackground,
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    textAlign: 'center',
    fontWeight: '600',
  },
  textDisabled: {},
});

export default AuthButton;
