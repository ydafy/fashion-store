import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface SettingsSectionProps {
  /**
   * El título que se muestra encima de la sección. Opcional.
   */
  title?: string;
  /**
   * Los componentes 'SettingsRow' que se renderizarán dentro de la sección.
   */
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.outerContainer}>
      {title && <Text style={styles.titleText}>{title}</Text>}
      <View style={styles.innerContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: verticalScale(24),
  },
  titleText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(16),
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  innerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    overflow: 'hidden', // Asegura que los bordes redondeados se apliquen a los hijos
    paddingHorizontal: scale(16), // Padding para el contenido interno
  },
});

export default SettingsSection;
