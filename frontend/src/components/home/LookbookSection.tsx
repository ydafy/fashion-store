import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { Image as ExpoImage } from 'expo-image';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

// --- Mock Types and Data ---
import { Look } from '../../types/look';
import mockLooks from '../../data/mockLooks.json';

// --- Components ---
import SectionHeader from '../common/SectionHeader';

// --- Constants and Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

const { width: screenWidth } = Dimensions.get('window');
const CAROUSEL_HEIGHT = verticalScale(450);

// We adjust the width of the main item. We want it to be the protagonist.
const ITEM_WIDTH = screenWidth * 0.8;

const LookbookSection: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);

  const handleSnapToItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDiscoverPress = (look: Look) => {
    console.log(
      `[LOOKBOOK] Descubrir look presionado. IDs de producto:`,
      look.productIds,
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader
        title={t('header:lookBook')}
        actionText={t('common:viewAll')}
        onActionPress={() => console.log('Ver todos los looks')}
      />
      <Carousel
        width={ITEM_WIDTH}
        height={CAROUSEL_HEIGHT}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          width: screenWidth,
          height: CAROUSEL_HEIGHT,
          alignItems: 'center',
        }}
        data={mockLooks as Look[]}
        loop={false}
        autoPlay={false}
        mode="horizontal-stack"
        modeConfig={{
          snapDirection: 'left',
          stackInterval: 40,
        }}
        onSnapToItem={handleSnapToItem}
        renderItem={({ item: look }) => (
          <View style={styles.slide}>
            <ExpoImage
              source={{ uri: look.imageUri }}
              style={styles.image}
              contentFit="cover"
              transition={500}
            />
            <View style={styles.overlay}>
              <Text style={styles.title} numberOfLines={2}>
                {look.title}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDiscoverPress(look)}
              >
                <Text style={styles.buttonText}>
                  {t('common:shopNowButton')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(30),
  },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: moderateScale(5),
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    width: ITEM_WIDTH,
    // backgroundColor: COLORS.separator,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.34,
    // shadowRadius: 6.27,
    // elevation: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  // eslint-disable-next-line react-native/no-color-literals
  overlay: {
    padding: moderateScale(20),
    backgroundColor: 'rgba(0,0,0,0.50)',
  },
  // eslint-disable-next-line react-native/no-color-literals
  title: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(28),
    fontWeight: '600',
    color: COLORS.primaryBackground,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 6,
  },
  // eslint-disable-next-line react-native/no-color-literals
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(18),
    borderRadius: moderateScale(30),
    alignSelf: 'flex-start',
    marginTop: verticalScale(12),
  },
  buttonText: {
    color: COLORS.primaryText,
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
});

export default LookbookSection;
