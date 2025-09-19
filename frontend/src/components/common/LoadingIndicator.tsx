import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  StyleProp
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling'; // Asumiendo que usas tu helper de escalado

interface LoadingIndicatorProps {
  /**
   * El tamaño del indicador. Puede ser 'small', 'large' o un número para el radio.
   * @default 'large'
   */
  size?: 'small' | 'large' | number;
  /**
   * El color del indicador.
   * @default COLORS.primary
   */
  color?: string;
  /**
   * Texto opcional para mostrar debajo del indicador.
   */
  text?: string;
  /**
   * Estilo personalizado para el contenedor del componente.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Si es `true`, el componente ocupará todo el espacio disponible y se centrará.
   * Útil para un estado de carga de pantalla completa.
   * @default false
   */
  fullscreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color = COLORS.primaryBackground, // Usamos un color primario por defecto
  text,
  style,
  fullscreen = false
}) => {
  const { t } = useTranslation();
  const loadingText = text || t('common:loading');

  return (
    <View style={[styles.container, fullscreen && styles.fullscreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {/* Mostramos el texto solo si se proporciona la prop 'text' o si no es fullscreen */}
      {text && <Text style={[styles.text, { color }]}>{loadingText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(10)
  },
  fullscreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Un fondo semitransparente
    zIndex: 10
  },
  text: {
    marginTop: moderateScale(10),
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular' // Tu fuente personalizada
  }
});

export default LoadingIndicator;
