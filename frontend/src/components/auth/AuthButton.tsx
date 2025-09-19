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

// ✨ 1. MODIFICAMOS LAS PROPS: 'title' ahora es opcional y añadimos 'children'
interface AuthButtonProps {
  title?: string; // Hacemos 'title' opcional para retrocompatibilidad
  children?: React.ReactNode; // 'children' puede ser cualquier cosa que React pueda renderizar
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
  children, // Recibimos 'children'
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
        // ✨ 2. LÓGICA DE RENDERIZADO: Si nos pasan 'children', los renderizamos.
        // Si no, renderizamos el 'title' como antes para no romper otros componentes.
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

// ✨ 3. Aplicamos scaling y añadimos estilos para el icono
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
  // ✨ Nuevo contenedor para icono + texto
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ✨ Nuevo wrapper para el icono
  iconWrapper: {
    marginRight: scale(8),
  },
  text: {
    color: COLORS.primaryBackground,
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    textAlign: 'center',
    fontWeight: '600', // Un poco más de peso para los botones
  },
  textDisabled: {},
});

export default AuthButton;
