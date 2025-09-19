import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import ErrorBoundary, { ErrorBoundaryProps } from 'react-native-error-boundary';
import { useTranslation } from 'react-i18next';

// Importamos nuestro componente de error existente para la UI de fallback
import ErrorDisplay from './ErrorDisplay';
import { scale, verticalScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

const ErrorBoundaryComponent = ErrorBoundary as any;

export type CustomFallbackProps = {
  error: Error;
  resetError: () => void;
};

/**
 * Componente Fallback que se muestra cuando ocurre un error de renderizado
 */
const FallbackComponent: React.FC<CustomFallbackProps> = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.fallbackContainer}>
      <ErrorDisplay
        message={t('common:errors.renderErrorMessage')}
        subtext={t('common:errors.renderErrorTitle')}
      />
    </View>
  );
};

/**
 * Handler para errores de renderizado
 * @param error - El error capturado
 * @param stackTrace - El stack trace del error
 */
const errorHandler = (error: Error, stackTrace: string) => {
  // TODO: Integrar con Sentry o similar en el futuro
  console.error('=== Render Error ===');
  console.error('Error:', error);
  console.error('Stack Trace:', stackTrace);
};

interface CustomErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<CustomFallbackProps>;
  onError?: (error: Error, stackTrace: string) => void;
}

/**
 * Error Boundary personalizado que envuelve componentes y maneja errores de renderizado
 */
const CustomErrorBoundary: React.FC<CustomErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
}) => {
  return (
    <ErrorBoundaryComponent
      FallbackComponent={fallback || FallbackComponent}
      onError={onError || errorHandler}
    >
      {children}
    </ErrorBoundaryComponent>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    padding: scale(20),
    backgroundColor: COLORS.primaryBackground,
    minHeight: verticalScale(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomErrorBoundary;
