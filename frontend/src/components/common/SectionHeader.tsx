import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity, // ✨ AÑADIDO
} from 'react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface SectionHeaderProps {
  /**
   * El texto del título a mostrar.
   */
  title: string;
  /**
   * Estilos opcionales para el contenedor principal.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * ✨ AÑADIDO: Texto opcional para el botón de acción a la derecha.
   */
  actionText?: string;
  /**
   * ✨ AÑADIDO: Función que se ejecuta al presionar el botón de acción.
   * Solo se muestra el botón si esta prop y 'actionText' existen.
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

      {/* ✨ LÓGICA AÑADIDA: Renderizamos el botón solo si tenemos el texto y la función */}
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
