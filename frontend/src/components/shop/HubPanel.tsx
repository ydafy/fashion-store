import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image'; // ✨ Importamos ExpoImage

import { HubPanel as HubPanelType } from '../../types/promotionalHub';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';
import { IconFactory } from '../icons/IconFactory';
import { TranslationObject } from '../../types/category';

interface HubPanelProps {
  panel: HubPanelType;
  onPress: (action: HubPanelType['action']) => void;
  type: 'main' | 'secondary';
}

const HubPanel: React.FC<HubPanelProps> = ({ panel, onPress, type }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language as keyof TranslationObject;
  const panelTitle = panel.title[lang] || panel.title.es;
  const isMain = type === 'main';

  // Para el panel principal con imagen, el texto y el icono deben ser claros
  const contentColor = isMain ? COLORS.white : COLORS.primaryText;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMain ? styles.mainPanel : styles.secondaryPanel,
      ]}
      activeOpacity={0.8}
      onPress={() => onPress(panel.action)}
    >
      {/* ✨ 1. RENDERIZADO DE IMAGEN DE FONDO */}
      {isMain && panel.imageUrl && (
        <ExpoImage
          source={{ uri: panel.imageUrl }}
          style={StyleSheet.absoluteFill} // Ocupa todo el espacio del contenedor
          contentFit="cover"
        />
      )}

      {/* ✨ 2. AÑADIMOS UN OVERLAY para mejorar la legibilidad del texto sobre la imagen */}
      {isMain && <View style={styles.overlay} />}

      {/* ✨ 3. Lógica de Icono Simplificada */}
      {/* El icono de esquina ahora se muestra siempre que exista */}
      {panel.icon && (
        <View style={styles.iconContainer}>
          <IconFactory
            name={panel.icon as any}
            size={moderateScale(isMain ? 32 : 30)}
            color={contentColor}
          />
        </View>
      )}

      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.title,
            isMain ? styles.mainTitle : styles.secondaryTitle,
            { color: contentColor },
          ]}
          numberOfLines={2}
        >
          {panelTitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  mainPanel: {
    backgroundColor: COLORS.primaryText, // Un color de fallback si la imagen no carga
  },
  secondaryPanel: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.separator,
    justifyContent: 'center', // Centramos el contenido de los paneles secos
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    //backgroundColor: 'rgba(0, 0, 0, 0.3)', // Overlay oscuro
  },
  iconContainer: {
    position: 'absolute',
    top: moderateScale(15),
    left: moderateScale(15),
    // ✨ Añadimos sombra al icono para que resalte sobre la imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  titleContainer: {
    position: 'absolute',
    bottom: moderateScale(15),
    right: moderateScale(15),
  },
  title: {
    fontFamily: 'FacultyGlyphic-Regular',
    textAlign: 'right',

    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  mainTitle: {
    fontSize: moderateScale(22),
    fontWeight: '600',
  },
  secondaryTitle: {
    position: 'relative',
    bottom: 'auto',
    right: 'auto',
    marginTop: moderateScale(8),
    fontSize: moderateScale(18),
    textAlign: 'center',
    textShadowRadius: 0,
  },
});

export default HubPanel;
