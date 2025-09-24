import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface EmptyStateProps {
  /**
   * The main text to display.
   */
  message: string;

  /**
   * Optional secondary text to provide more context or a call to action.
   */
  subtext?: string;

  /**
   *  A React element to display as an icon.
   * This makes the component agnostic to the icon library.
   */
  icon?: React.ReactElement;

  /**
   * Custom style for the parent container.
   */
  style?: StyleProp<ViewStyle>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  subtext,
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/*  We render the icon if provided */}
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={styles.messageText}>{message}</Text>
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
    minHeight: moderateScale(150),
  },

  iconWrapper: {
    marginBottom: moderateScale(15),
    opacity: 0.8,
  },
  messageText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(8),
  },
  subtext: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontFamily: 'FacultyGlyphic-Regular',
    lineHeight: moderateScale(20),
  },
});

export default EmptyState;
