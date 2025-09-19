import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import { COLORS } from '../../constants/colors';

interface AuthLinkProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>; // Para estilos de texto adicionales
  containerStyle?: StyleProp<ViewStyle>; // Para estilos del contenedor TouchableOpacity
}

const AuthLink: React.FC<AuthLinkProps> = ({
  text,
  onPress,
  style,
  containerStyle
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
    paddingVertical: 8 // Un poco de padding para facilitar el toque
    // alignItems: 'center', // Descomenta si quieres que el texto esté centrado si el Touchable es más ancho
  },
  text: {
    color: COLORS.primaryText, // Color por defecto (oscuro, como en "Sign up")
    // Para "Forgot password?" podríamos pasar un color diferente vía props.
    fontSize: 15,
    fontFamily: 'FacultyGlyphic-Regular',
    // textDecorationLine: 'underline', // Opcional: si quieres subrayado
    textAlign: 'center' // Por si el contenedor es más ancho
  }
});

export default AuthLink;
