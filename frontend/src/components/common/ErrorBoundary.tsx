import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { useTranslation } from 'react-i18next';

import ErrorDisplay from './ErrorDisplay';
import { scale, verticalScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

const ErrorBoundaryComponent = ErrorBoundary as any;

export type CustomFallbackProps = {
  error: Error;
  resetError: () => void;
};

/**
 * Fallback component that is displayed when a rendering error occurs
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
 * Handler for rendering errors
 * @param error - The captured error
 * @param stackTrace - The error stack trace
 */
const errorHandler = (error: Error, stackTrace: string) => {
  // TODO: Integrate with Sentry or similar in the future
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
 * Custom Error Boundary that wraps components and handles rendering errors
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
