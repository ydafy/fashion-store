import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SectionCardData } from '../../types/product'; // Tipo para los datos de la tarjeta de sección
import { HomeScreenNavigationProp } from '../../types/navigation'; // Tipo de navegación
import SectionCard from '../common/sectionCard'; // Ajusta la ruta a donde moviste/tienes SectionCard
import { COLORS } from '../../constants/colors';
import SectionHeader from './../common/SectionHeader';

import SectionCardSkeleton from '../skeletons/SectionCardSkeleton';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');
const SECTION_CARD_SPACING = 15; // Espacio entre las tarjetas de sección
const SECTION_CARD_WIDTH_PERCENTAGE = 0.7;
const SECTION_CARD_WIDTH = screenWidth * SECTION_CARD_WIDTH_PERCENTAGE;
const SECTION_CARD_ASPECT_RATIO = 4 / 5;
const SECTION_CARD_HEIGHT = SECTION_CARD_WIDTH / SECTION_CARD_ASPECT_RATIO;

interface CollectionsSectionProps {
  sections: SectionCardData[];
  navigation: HomeScreenNavigationProp; // O el tipo específico que use HomeScreen
  title?: string; // Título opcional para la sección
  isLoading: boolean;
}

const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  sections,
  navigation,
  title, // Título por defecto
  isLoading,
}) => {
  const { t } = useTranslation();
  const sectionTitle = title || t('home:collections.titleDefault');
  if (isLoading) {
    const skeletonData = Array.from({ length: 2 }); // Muestra 2 skeletons para colecciones (o ajusta)
    return (
      <View style={styles.sectionWrapper}>
        <SectionHeader
          title={sectionTitle}
          style={styles.sectionHeaderLoadingStyle}
        />
        {/* O usar SectionHeader si lo tienes */}
        <FlatList
          data={skeletonData}
          renderItem={() => (
            <View style={styles.sectionCardItemContainerSkeleton}>
              <SectionCardSkeleton />
            </View>
          )}
          keyExtractor={(_, index) => `collection-skeleton-${index}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SECTION_CARD_SPACING,
            paddingVertical: 16,
          }}
          ItemSeparatorComponent={() => (
            <View style={{ width: SECTION_CARD_SPACING }} />
          )}
        />
      </View>
    );
  }

  // ... (lógica para renderSectionCard y return normal como antes)
  // Si no está cargando y no hay secciones
  if (!sections || sections.length === 0) {
    return (
      <View style={styles.sectionWrapper}>
        <SectionHeader title={sectionTitle} />
        <Text style={styles.emptySectionText}>
          {t('home:collections.emptyMessage')}
        </Text>
      </View>
    );
  }
  const renderSectionCard = ({ item }: { item: SectionCardData }) => (
    <View style={styles.sectionCardItemContainer}>
      <SectionCard
        imageUrl={item.imageUrl}
        title={item.title}
        navigation={navigation} // SectionCard espera navigation
      />
    </View>
  );

  return (
    <View style={styles.sectionWrapper}>
      <SectionHeader title={sectionTitle} />
      <FlatList
        data={sections}
        renderItem={renderSectionCard}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SECTION_CARD_SPACING,
          paddingVertical: 16, // Padding vertical que tenías
        }}
        ItemSeparatorComponent={() => (
          <View style={{ width: SECTION_CARD_SPACING }} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    // Contenedor para toda la sección
    marginBottom: 20, // Espacio después de esta sección
  },
  sectionHeaderLoadingStyle: {},

  sectionCardItemContainer: {
    width: SECTION_CARD_WIDTH, // Ancho que tenías para SectionCard
    height: SECTION_CARD_HEIGHT,
  },
  emptySectionText: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    color: COLORS.secondaryText,
    textAlign: 'center',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  sectionCardItemContainerSkeleton: {
    width: SECTION_CARD_WIDTH,
    height: SECTION_CARD_HEIGHT,
  },
  sectionTitleText: {
    fontSize: 24,
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: 15,
    paddingHorizontal: 20,
    textAlign: 'left',
  },
});

export default CollectionsSection;
