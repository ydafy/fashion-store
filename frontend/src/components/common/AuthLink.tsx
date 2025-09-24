import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../constants/colors';

interface AuthLinkProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>; // For additional text styles
  containerStyle?: StyleProp<ViewStyle>; // For TouchableOpacity container styles
}

const AuthLink: React.FC<AuthLinkProps> = ({
  text,
  onPress,
  style,
  containerStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      activeOpacity={0.6}
    >
      <Text style={[styles.text, style]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  text: {
    color: COLORS.primaryText,

    fontSize: 15,
    fontFamily: 'FacultyGlyphic-Regular',
    // textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default AuthLink;
