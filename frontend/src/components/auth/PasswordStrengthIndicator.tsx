import React, { useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { checkPasswordStrength } from '../../utils/passwordStrength';
import { moderateScale, verticalScale } from '../../utils/scaling';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
}) => {
  const { t } = useTranslation();

  // We use useMemo to not recalculate the strength on every render, only if the password changes.
  const strength = useMemo(() => checkPasswordStrength(password), [password]);

  // We don't render anything if there is no password or if it is very weak (the message is already in the validator)
  if (!password || strength.level === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* We might add a progress bar here in the future */}
      <Text style={[styles.strengthText, { color: strength.color }]}>
        {t(strength.textKey)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(-10),
    marginBottom: verticalScale(10),
    alignItems: 'flex-start',
  },
  strengthText: {
    fontSize: moderateScale(12),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default PasswordStrengthIndicator;
