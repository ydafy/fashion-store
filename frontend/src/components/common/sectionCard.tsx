// src/components/common/SectionCard.tsx
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
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
  navigation,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.cardContainer}>
      <ExpoImageBackground
        source={{ uri: imageUrl }}
        style={styles.backgroundImage}
        contentFit="cover"
        placeholder={SECTION_IMAGE_PLACEHOLDER}
        transition={300}
        onError={(e) =>
          console.warn(
            `[SectionCard] Error cargando imagen de fondo: ${imageUrl}`,
            e.error,
          )
        }
      >
        <View style={styles.overlayContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              const params = { sectionTitle: title }; // We create the parameters object

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
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: scale(20),
  },
  titleText: {
    fontSize: 28,
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  buyButton: {
    backgroundColor: COLORS.white,
    paddingVertical: scale(12),
    paddingHorizontal: scale(30),
    borderRadius: 25,
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SectionCard;
