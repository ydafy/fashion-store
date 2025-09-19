// src/components/common/SectionCard.tsx
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { ImageBackground as ExpoImageBackground } from 'expo-image';

import { SectionCardProps } from '../../types/components';
import { COLORS } from '../../constants/colors';
import { useTranslation } from 'react-i18next';
import { scale } from '../../utils/scaling';

const SECTION_IMAGE_PLACEHOLDER = require('../../../assets/images/placeholder.png');

const SectionCard: React.FC<SectionCardProps> = ({
  imageUrl,
  title,
  navigation
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.cardContainer}>
      <ExpoImageBackground
        source={{ uri: imageUrl }} //  Usa la prop imageUrl como fuente de la imagen de fondo
        style={styles.backgroundImage}
        contentFit="cover"
        placeholder={SECTION_IMAGE_PLACEHOLDER}
        transition={300}
        onError={(e) =>
          console.warn(
            `[SectionCard] Error cargando imagen de fondo: ${imageUrl}`,
            e.error
          )
        }
      >
        <View style={styles.overlayContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              const params = { sectionTitle: title }; // Creamos el objeto de parámetros

              navigation.navigate('Section', params);
            }}
          >
            <Text style={styles.buyButtonText}>
              {t('common:shopNowButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </ExpoImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%', // Ancho de la card (90% del ancho de la pantalla - ajustable)
    height: '100%', // Altura de la card (ajusta según la proporción deseada para tus imágenes)
    borderRadius: 15, // Bordes redondeados
    overflow: 'hidden', //  Importante para que la imagen y el degradado respeten los bordes redondeados
    backgroundColor: COLORS.lightGray // Color de fondo de fallback mientras carga la imagen (opcional)
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Centra el contenido verticalmente dentro de la imagen
    alignItems: 'center' // Centra el contenido horizontalmente dentro de la imagen
  },
  overlayContainer: {
    flex: 1, //  Para que ocupe todo el espacio disponible dentro de ImageBackground
    justifyContent: 'space-around', // Distribuye el espacio entre el título y el botón (título arriba, botón abajo)
    alignItems: 'center', // Centra horizontalmente el título y el botón
    padding: scale(20)
  },
  titleText: {
    fontSize: 28, // Tamaño del título (ajusta según necesites)
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.white, // Color del texto del título (blanco)
    textAlign: 'center', // Alineación del texto del título al centro
    fontWeight: '500'
  },
  buyButton: {
    backgroundColor: COLORS.white, // Color de fondo del botón "Comprar" (blanco)
    paddingVertical: scale(12), // Padding vertical del botón
    paddingHorizontal: scale(30), // Padding horizontal del botón
    borderRadius: 25 // Bordes redondeados del botón
  },
  buyButtonText: {
    fontSize: 16, // Tamaño del texto del botón "Comprar" (ajusta según necesites)
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText, // Color del texto del botón "Comprar" (negro)
    textAlign: 'center', // Alineación del texto del botón al centro
    fontWeight: '600'
  }
});

export default SectionCard;
