import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// --- Tipos y Hooks ---
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { useFaqData } from '../../hooks/useFaqData';
import { FaqCategory } from '../../types/faq';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import AccordionItem from '../../components/common/AccordionItem';
import CategorySkeleton from '../../components/skeletons/CategorySkeleton';
import ErrorDisplay from '../../components/common/ErrorDisplay';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

// Sub-componente para la VISTA PREVIA dentro del acordeón
const FaqCategoryContent = ({
  category,
  t,
}: {
  category: FaqCategory;
  t: TFunction;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const onSeeAllPress = () => {
    navigation.navigate('QAScreen', {
      categoryId: category.id,
      categoryTitleKey: category.categoryTitleKey,
    });
  };

  // Mostramos hasta 3 preguntas como vista previa
  const questionsToShow = category.questions.slice(0, 3);

  return (
    <View style={styles.accordionContent}>
      {questionsToShow.map((item) => (
        <Text key={item.id} style={styles.questionPreview}>
          {t(item.questionKey.replace('.', ':'))}
        </Text>
      ))}

      {category.questions.length > 0 && (
        <TouchableOpacity onPress={onSeeAllPress} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>{t('common:viewAll')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const FAQScreen = () => {
  const { t } = useTranslation(['profile', 'faq', 'common', 'errors']);
  const { data, isLoading, isError, refetch } = useFaqData();

  const renderItem = ({ item }: { item: FaqCategory }) => (
    <AccordionItem
      title={t(
        item.categoryTitleKey ? item.categoryTitleKey.replace('.', ':') : '',
      )}
      style={styles.accordionContainer}
    >
      <FaqCategoryContent category={item} t={t} />
    </AccordionItem>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View>
          {Array.from({ length: 5 }).map((_, index) => (
            <CategorySkeleton key={index} />
          ))}
        </View>
      );
    }
    if (isError) {
      return (
        <ErrorDisplay
          message={t('common:errors.contentLoadErrorTitle')}
          subtext={t('common:errors.contentLoadErrorSubtext')}
          onRetry={refetch}
          style={styles.centered}
        />
      );
    }
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('profile:help.faq')} showBackButton />
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryBackground },
  contentContainer: { flex: 1, padding: moderateScale(20) },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  accordionContainer: { marginBottom: verticalScale(12) },
  accordionContent: { padding: moderateScale(16) },
  questionPreview: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    marginBottom: verticalScale(10),
    lineHeight: moderateScale(20),
  },
  seeAllButton: { marginTop: verticalScale(10), alignSelf: 'flex-start' },
  seeAllText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default FAQScreen;
