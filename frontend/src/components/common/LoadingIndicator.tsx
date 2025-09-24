import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface LoadingIndicatorProps {
  /**
   * The size of the indicator. Can be 'small', 'large', or a number for the radius.
   * @default 'large'
   */
  size?: 'small' | 'large' | number;
  /**
   * The color of the indicator.
   * @default COLORS.primary
   */
  color?: string;
  /**
   * Optional text to display below the indicator.
   */
  text?: string;
  /**
   * Custom style for the component container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * If `true`, the component will take up all available space and be centered.
   * Useful for a full-screen loading state.
   * @default false
   */
  fullscreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color = COLORS.primaryBackground,
  text,
  style,
  fullscreen = false,
}) => {
  const { t } = useTranslation();
  const loadingText = text || t('common:loading');

  return (
    <View style={[styles.container, fullscreen && styles.fullscreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {/* We only show the text if the 'text' prop is provided or if it is not fullscreen */}
      {text && <Text style={[styles.text, { color }]}>{loadingText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(10),
  },
  // eslint-disable-next-line react-native/no-color-literals
  fullscreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // A semi-transparent background
    zIndex: 10,
  },
  text: {
    marginTop: moderateScale(10),
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular', // Tu fuente personalizada
  },
});

export default LoadingIndicator;
