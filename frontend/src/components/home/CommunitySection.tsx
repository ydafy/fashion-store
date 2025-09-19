import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';

import SectionHeader from '../common/SectionHeader';
import CommunityPostModal from '../modal/CommunityPostModal';

import mockCommunityPosts from '../../data/mockCommunity.json';
import { CommunityPost } from '../../types/community';
import InfoModal from '../modal/InfoModal';

import { verticalScale, moderateScale, scale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

const CommunitySection: React.FC = () => {
  const { t } = useTranslation(['home', 'header', 'common']);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);

  // Usamos solo los 3 primeros posts para nuestro layout específico
  const displayPosts = mockCommunityPosts.slice(0, 3);

  if (displayPosts.length < 3) return null; // No renderizar si no hay suficientes posts

  return (
    <View style={styles.container}>
      <SectionHeader
        title={t('home:community.sectionHeader.title')}
        actionText={t('common:info')}
        onActionPress={() => setInfoModalVisible(true)}
      />
      <View style={styles.gridContainer}>
        {/* Columna Izquierda (Post Grande) */}
        <TouchableOpacity
          style={styles.largePost}
          activeOpacity={0.8}
          onPress={() => setSelectedPost(displayPosts[0])}
        >
          <ExpoImage
            source={{ uri: displayPosts[0].imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        </TouchableOpacity>

        {/* Columna Derecha (2 Posts Pequeños) */}
        <View style={styles.rightColumn}>
          <TouchableOpacity
            style={styles.smallPost}
            activeOpacity={0.8}
            onPress={() => setSelectedPost(displayPosts[1])}
          >
            <ExpoImage
              source={{ uri: displayPosts[1].imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallPost, styles.lastSmallPost]}
            activeOpacity={0.8}
            onPress={() => setSelectedPost(displayPosts[2])}
          >
            <ExpoImage
              source={{ uri: displayPosts[2].imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
          </TouchableOpacity>
        </View>
      </View>

      <CommunityPostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
      <InfoModal
        isVisible={isInfoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title={t('home:community.infoModal.title')}
        message={t('home:community.infoModal.message', {
          handle: '@nombre_de_la_marca',
          hashtag: '#NombreDeLaMarca',
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(30),
  },
  gridContainer: {
    flexDirection: 'row',
    height: verticalScale(350),
    paddingHorizontal: moderateScale(20),
  },
  largePost: {
    flex: 1.2,
    marginRight: scale(10),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallPost: {
    flex: 1,
    backgroundColor: COLORS.separator,
    marginBottom: scale(10), // Margen para el espacio entre los dos pequeños
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  // ✨ ESTE ES EL NUEVO ESTILO MODIFICADOR
  lastSmallPost: {
    marginBottom: 0, // Quitamos el margen inferior solo para el último item
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default CommunitySection;
