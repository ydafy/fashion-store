import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSharedValue } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

// --- Tipos ---
import { RootStackParamList } from '../../types/navigation';
import { PromotionalHub, HubAction } from '../../types/promotionalHub';

import { TranslationObject } from '../../types/category';

// --- Componentes ---
import HubPanel from './HubPanel';
import SectionHeader from '../common/SectionHeader';

// --- Utils ---
import { verticalScale, scale, moderateScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

// ✨ 1. La interfaz de props ahora define lo que el componente recibe
interface PromotionalHubCarouselProps {
  title: TranslationObject;
  hubs: PromotionalHub[];
}

const PromotionalHubCarousel: React.FC<PromotionalHubCarouselProps> = ({
  title,
  hubs,
}) => {
  const { i18n } = useTranslation(); // ✨ 3. Obtenemos i18n
  const lang = i18n.language as keyof TranslationObject;
  const paginationProgress = useSharedValue<number>(0);
  const sectionTitle = title[lang] || title.es;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleActionPress = (action: HubAction) => {
    navigation.navigate('MainTabs', {
      screen: 'ComprarTab',
      params: {
        screen: 'Section',
        params: {
          filterPayload: action.payload,
          title: sectionTitle,
        },
      },
    });
  };

  const renderHubSlide = ({ item }: { item: PromotionalHub }) => (
    // ✨ 2. El slide ya no necesita un SectionHeader, porque ahora es externo
    <View style={styles.gridContainer}>
      <View style={styles.largePanelWrapper}>
        <HubPanel
          panel={item.mainPanel}
          onPress={handleActionPress}
          type="main"
        />
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.smallPanelWrapper}>
          <HubPanel
            panel={item.secondaryPanels[0]}
            onPress={handleActionPress}
            type="secondary"
          />
        </View>
        <View style={styles.smallPanelWrapper}>
          <HubPanel
            panel={item.secondaryPanels[1]}
            onPress={handleActionPress}
            type="secondary"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.sectionWrapper}>
      {/* ✨ 3. El SectionHeader ahora es parte de este componente, con el título fijo */}
      <SectionHeader title={sectionTitle} />
      <Carousel
        width={screenWidth}
        height={verticalScale(320)} // Altura ajustada ya que el título está fuera
        data={hubs}
        loop={false}
        renderItem={renderHubSlide}
        onProgressChange={paginationProgress}
      />
      {hubs.length > 1 && (
        // ✨ USAMOS UN WRAPPER PARA CENTRAR, IGUAL QUE EN FAVORITOS
        <View style={styles.paginationWrapper}>
          <Pagination.Basic
            progress={paginationProgress}
            data={hubs}
            dotStyle={styles.paginationDot}
            // ✨ PASAMOS EL COLOR ACTIVO DIRECTAMENTE COMO PROP
            activeDotStyle={{ backgroundColor: COLORS.primaryText }}
            containerStyle={styles.paginationContainer}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(30),
  },
  gridContainer: {
    flexDirection: 'row',
    height: verticalScale(300),
    paddingHorizontal: scale(20),
  },
  largePanelWrapper: {
    flex: 1.2,
    marginRight: scale(10),
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallPanelWrapper: {
    flex: 1,
    maxHeight: '48%',
  },
  // --- ✨ ESTILOS DE PAGINACIÓN ACTUALIZADOS ---

  paginationContainer: {
    // El container de Pagination.Basic no necesita estilos adicionales
    // ya que lo centramos con el wrapper.
  },
  paginationWrapper: {
    // Un nuevo contenedor para centrar todo
    width: '100%',
    alignItems: 'center',
    paddingTop: moderateScale(15),
  },
  paginationDot: {
    width: moderateScale(8), // Tamaño sutil
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginHorizontal: moderateScale(4), // Espaciado
    backgroundColor: COLORS.borderDefault, // Color para los puntos inactivos
  },
});

export default PromotionalHubCarousel;
