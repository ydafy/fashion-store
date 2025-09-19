import React from 'react';
// ✨ CORRECCIÓN: Importamos 'View' para envolver nuestros iconos.
import { StyleSheet, View } from 'react-native';
import { BaseToast, ToastConfigParams } from 'react-native-toast-message';

// --- Dependencias del Proyecto ---
import { COLORS } from '../constants/colors';
import { moderateScale } from '../utils/scaling';
import { IconFactory } from '../components/icons/IconFactory';

// --- Constantes y Tipos Locales ---

const FONT_FAMILY_REGULAR = 'FacultyGlyphic-Regular';

type CustomToastProps = {};

// ✨ CORRECCIÓN: Movemos la creación de los estilos ANTES de que se usen.
// Esto soluciona el error "styles used before its declaration".
const styles = StyleSheet.create({
  baseToastStyle: {
    borderLeftWidth: moderateScale(6),
    width: '90%',
    height: 'auto',
    minHeight: moderateScale(65),
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
  },
  text1: {
    fontSize: moderateScale(15),
    fontFamily: FONT_FAMILY_REGULAR,
    color: COLORS.primaryText,
    fontWeight: '600',
    marginBottom: moderateScale(4),
  },
  text2: {
    fontSize: moderateScale(13),
    fontFamily: FONT_FAMILY_REGULAR,
    color: COLORS.secondaryText,
    lineHeight: moderateScale(18),
  },
  iconContainer: {
    // ✨ CORRECCIÓN: Renombramos 'iconStyle' a 'iconContainer' por claridad.
    marginHorizontal: moderateScale(12),
    alignSelf: 'center',
  },
});

/**
 * @description Propiedades comunes que se aplicarán a todos nuestros toasts.
 */
const commonToastProps = {
  style: styles.baseToastStyle,
  contentContainerStyle: styles.contentContainer,
  text1Style: styles.text1,
  text2Style: styles.text2,
  text1NumberOfLines: 2,
  text2NumberOfLines: 3,
};

// --- Configuración Principal del Toast ---
export const toastConfig = {
  success: (props: ToastConfigParams<CustomToastProps>) => (
    <BaseToast
      {...props}
      {...commonToastProps}
      style={[styles.baseToastStyle, { borderLeftColor: COLORS.success }]}
      renderLeadingIcon={() => (
        // ✨ CORRECCIÓN: Envolvemos IconFactory en un View para aplicar el estilo.
        <View style={styles.iconContainer}>
          <IconFactory
            name="CheckCircle"
            color={COLORS.success}
            size={moderateScale(26)}
            weight="regular"
          />
        </View>
      )}
    />
  ),

  error: (props: ToastConfigParams<CustomToastProps>) => (
    <BaseToast
      {...props}
      {...commonToastProps}
      style={[styles.baseToastStyle, { borderLeftColor: COLORS.error }]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <IconFactory
            name="WarningCircle"
            color={COLORS.error}
            size={moderateScale(26)}
            weight="regular"
          />
        </View>
      )}
    />
  ),

  info: (props: ToastConfigParams<CustomToastProps>) => (
    <BaseToast
      {...props}
      {...commonToastProps}
      style={[styles.baseToastStyle, { borderLeftColor: COLORS.info }]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <IconFactory
            name="Info"
            color={COLORS.info}
            size={moderateScale(26)}
            weight="regular"
          />
        </View>
      )}
    />
  ),

  warning: (props: ToastConfigParams<CustomToastProps>) => (
    <BaseToast
      {...props}
      {...commonToastProps}
      style={[styles.baseToastStyle, { borderLeftColor: COLORS.warning }]}
      renderLeadingIcon={() => (
        <View style={styles.iconContainer}>
          <IconFactory
            name="Warning"
            color={COLORS.warning}
            size={moderateScale(26)}
            weight="regular"
          />
        </View>
      )}
    />
  ),
};
