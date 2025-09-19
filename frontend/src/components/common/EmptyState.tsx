import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
// Ya no necesitamos Ionicons aquí, el componente padre nos pasará el icono
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface EmptyStateProps {
  /**
   * El texto principal que se mostrará.
   */
  message: string;

  /**
   * Texto secundario opcional para dar más contexto o una llamada a la acción.
   */
  subtext?: string;

  /**
   * ✨ Un elemento React para mostrar como icono.
   * Esto hace al componente agnóstico a la librería de iconos.
   */
  icon?: React.ReactElement;

  /**
   * Estilo personalizado para el contenedor principal.
   */
  style?: StyleProp<ViewStyle>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  subtext,
  icon, // Usamos la nueva prop
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* ✨ Renderizamos el icono si se proporciona */}
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
    minHeight: moderateScale(150)
  },
  // ✨ Cambiamos 'icon' a 'iconWrapper' para mayor claridad
  iconWrapper: {
    marginBottom: moderateScale(15),
    opacity: 0.8
  },
  messageText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(8)
  },
  subtext: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontFamily: 'FacultyGlyphic-Regular',
    lineHeight: moderateScale(20)
  }
});

export default EmptyState;
