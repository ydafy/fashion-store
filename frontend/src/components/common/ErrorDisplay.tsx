import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
// ✨ REFACTOR: Importamos nuestro IconFactory
import { IconFactory } from '../icons/IconFactory';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface ErrorDisplayProps {
  /**
   * ✨ REFACTOR: El mensaje principal del error.
   */
  message: string;
  /**
   * ✨ REFACTOR: Texto secundario opcional.
   */
  subtext?: string;
  /**
   * Función opcional para el botón de reintentar. Si se proporciona, se muestra el botón.
   */
  onRetry?: () => void;
  /**
   * Estilos opcionales para el contenedor.
   */
  style?: StyleProp<ViewStyle>;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  subtext,
  onRetry,
  style,
}) => {
  const { t } = useTranslation('common');

  return (
    <View style={[styles.errorContainer, style]}>
      {/* ✨ REFACTOR: Usamos IconFactory para consistencia */}
      <IconFactory
        name="CloudSlashIcon"
        size={moderateScale(60)}
        color={COLORS.error}
        //style={styles.icon}
        weight="light"
      />
      <Text style={styles.errorTitle}>{message}</Text>
      {subtext && <Text style={styles.errorMessage}>{subtext}</Text>}
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t('retry')}
        >
          <Text style={styles.retryButtonText}>{t('retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },

  errorTitle: {
    fontSize: moderateScale(20),
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: moderateScale(8),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: moderateScale(16),
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: moderateScale(25),
    fontFamily: 'FacultyGlyphic-Regular',
    lineHeight: moderateScale(22),
  },
  retryButton: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(35),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(10),
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default ErrorDisplay;
