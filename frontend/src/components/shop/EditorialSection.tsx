import React, { useCallback, memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PressableStateCallbackType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Image as ExpoImage } from 'expo-image';

import { useEditorials } from '../../hooks/useEditorials';
import { RootStackParamList } from '../../types/navigation';
import {
  EditorialCard as EditorialCardType,
  TranslationObject,
} from '../../types/editorial';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { EDITORIAL } from '../../constants/ui';

import SectionHeader from '../common/SectionHeader';
import ErrorDisplay from '../common/ErrorDisplay';
import { Skeleton } from '../skeletons/Skeleton';

interface EditorialCardProps {
  card: EditorialCardType;
  currentLanguage: string;
  onPress: (card: EditorialCardType) => void;
  testID?: string;
}

const EditorialSkeleton = memo(() => (
  <View style={styles.skeletonCard}>
    <Skeleton style={styles.skeletonImage} />
    <Skeleton style={styles.skeletonTitle} />
  </View>
));

const EditorialCard = memo(
  ({ card, currentLanguage, onPress, testID }: EditorialCardProps) => {
    const { t } = useTranslation();

    const title = useMemo(
      () =>
        card.title[currentLanguage as keyof TranslationObject] ||
        card.title['en'],
      [card.title, currentLanguage],
    );

    const [isPressed, setIsPressed] = React.useState(false);

    const handlePress = useCallback(() => {
      onPress(card);
    }, [card, onPress]);

    return (
      <TouchableOpacity
        key={card.id}
        style={[styles.cardContainer, isPressed ? styles.cardPressed : null]}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={handlePress}
        activeOpacity={EDITORIAL.TOUCH_CONFIG.ACTIVE_OPACITY}
        pressRetentionOffset={EDITORIAL.TOUCH_CONFIG.PRESS_RETENTION}
        hitSlop={EDITORIAL.TOUCH_CONFIG.HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={t('shop:editorials.cardA11yLabel', { title })}
        accessibilityHint={t('shop:editorials.cardA11yHint')}
        testID={testID}
      >
        <View style={styles.imageContainer}>
          <ExpoImage
            source={card.imageUrl}
            style={styles.image}
            contentFit="cover"
            transition={EDITORIAL.TRANSITION_MS}
            accessibilityIgnoresInvertColors
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.currentLanguage === nextProps.currentLanguage
    );
  },
);

const EditorialSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, status, refetch } = useEditorials();
  const currentLanguage = i18n.language;

  const handleCardPress = useCallback(
    (card: EditorialCardType) => {
      const title =
        card.title[currentLanguage as keyof TranslationObject] ||
        card.title['en'] ||
        'Section';

      navigation.navigate('MainTabs', {
        screen: 'ComprarTab',
        params: {
          screen: 'Section',
          params: {
            title,
            filterPayload: card.action.payload,
          },
        },
      });
    },
    [currentLanguage, navigation],
  );

  const isValidEditorial = useCallback((card: EditorialCardType): boolean => {
    return Boolean(
      card?.id &&
        card?.imageUrl &&
        card?.title &&
        Object.keys(card.title).length > 0 &&
        card?.action?.payload,
    );
  }, []);

  const renderEditorialCards = useCallback(() => {
    if (!data?.length) return null;

    return data
      .filter(isValidEditorial)
      .map((card) => (
        <EditorialCard
          key={card.id}
          card={card}
          currentLanguage={currentLanguage}
          onPress={handleCardPress}
          testID={`editorial-card-${card.id}`}
        />
      ));
  }, [data, currentLanguage, handleCardPress, isValidEditorial]);

  const renderContent = useCallback(() => {
    switch (status) {
      case 'pending':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            accessibilityRole="scrollbar"
            accessibilityLabel={t('shop:editorials.loadingA11yLabel')}
          >
            {Array.from({ length: EDITORIAL.SKELETON_COUNT }).map(
              (_, index) => (
                <EditorialSkeleton key={index} />
              ),
            )}
          </ScrollView>
        );
      case 'error':
        return (
          <ErrorDisplay
            message={t('shop:editorials.error')}
            onRetry={refetch}
            //testID="editorial-error"
          />
        );
      case 'success':
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            snapToInterval={scale(EDITORIAL.CARD_WIDTH + 40)}
            decelerationRate={EDITORIAL.SCROLL_CONFIG.DECELERATION_RATE}
            accessibilityRole="scrollbar"
            accessibilityLabel={t('shop:editorials.a11yLabel')}
          >
            {renderEditorialCards()}
          </ScrollView>
        );
      default:
        return null;
    }
  }, [status, renderEditorialCards, t, refetch]);

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader title={t('shop:editorials.title')} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: verticalScale(20),
  },
  scrollContainer: {
    paddingHorizontal: moderateScale(10),
  },
  cardContainer: {
    marginRight: moderateScale(40),
    width: scale(EDITORIAL.CARD_WIDTH),
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(EDITORIAL.CARD_HEIGHT),
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    backgroundColor: COLORS.separator,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: verticalScale(8),
  },
  titleText: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  skeletonCard: {
    marginRight: moderateScale(15),
    width: scale(EDITORIAL.CARD_WIDTH),
  },
  skeletonImage: {
    width: '100%',
    height: verticalScale(EDITORIAL.CARD_HEIGHT),
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.separator,
  },
  skeletonTitle: {
    height: verticalScale(20),
    width: scale(100),
    marginTop: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: COLORS.separator,
  },
  cardPressed: {
    transform: [{ scale: EDITORIAL.ANIMATION.SCALE_PRESSED }],
    opacity: EDITORIAL.ANIMATION.OPACITY_PRESSED,
  },
});

export default memo(EditorialSection);
