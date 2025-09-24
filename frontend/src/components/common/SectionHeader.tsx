import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface SectionHeaderProps {
  /**
   * The title text to display.
   */
  title: string;
  /**
   * Optional styles for the parent container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   *  Optional text for the action button on the right.
   */
  actionText?: string;
  /**
   *  Function that runs when the action button is pressed.
   * The button is only displayed if this prop and 'actionText' exist.
   */
  onActionPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  style,
  actionText,
  onActionPress,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="header">
      <Text style={styles.titleText}>{title}</Text>

      {/* ✨ ADDED LOGIC: We render the button only if we have the text and the function */}
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: moderateScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
  },
  titleText: {
    fontSize: moderateScale(22),
    paddingHorizontal: moderateScale(10),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600',
    flex: 1,
  },

  actionText: {
    fontSize: moderateScale(15),
    marginRight: moderateScale(10),
    color: COLORS.accent,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600',
  },
});

export default SectionHeader;
