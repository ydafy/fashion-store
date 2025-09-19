import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  checkPasswordStrength,
  PasswordStrengthResult,
} from '../../utils/passwordStrength';
import { moderateScale, verticalScale } from '../../utils/scaling';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
}) => {
  const { t } = useTranslation();

  // Usamos useMemo para no recalcular la fortaleza en cada render, solo si la contraseña cambia.
  const strength = useMemo(() => checkPasswordStrength(password), [password]);

  // No renderizamos nada si no hay contraseña o si es muy débil (el mensaje ya está en el validador)
  if (!password || strength.level === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Podríamos añadir una barra de progreso aquí en el futuro */}
      <Text style={[styles.strengthText, { color: strength.color }]}>
        {t(strength.textKey)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(-10), // Espacio negativo para acercarlo al input
    marginBottom: verticalScale(10),
    alignItems: 'flex-start',
  },
  strengthText: {
    fontSize: moderateScale(12),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default PasswordStrengthIndicator;
