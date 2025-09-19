import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// --- Tipos y Hooks ---
import { QAScreenRouteProp } from '../../types/navigation';
import { useFaqData } from '../../hooks/useFaqData';
import { FaqItem } from '../../types/faq';
import { useSubmitFaqFeedback } from '../../hooks/useSubmitFaqFeedback';
import { useFaqFeedbackStats } from '../../hooks/useFaqFeedbackStats';
import { useVoteManager } from '../../hooks/useVoteManager';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import AccordionItem from '../../components/common/AccordionItem';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import EmptyState from '../../components/common/EmptyState';
import { IconFactory } from '../../components/icons/IconFactory';
import FeedbackButtons from '../../components/faq/FeedbackButtons';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

const QAScreen = () => {
  const { t } = useTranslation(['faq', 'common', 'errors']);
  const route = useRoute<QAScreenRouteProp>();
  const { categoryId, categoryTitleKey } = route.params;
  const { mutate: submitFeedback } = useSubmitFaqFeedback();

  const { hasVoted, registerVote } = useVoteManager();

  const { data: allFaqData, isLoading, isError, refetch } = useFaqData();

  const categoryQuestions = useMemo(() => {
    if (!allFaqData) return [];
    const category = allFaqData.find((cat) => cat.id === categoryId);
    return category ? category.questions : [];
  }, [allFaqData, categoryId]);

  const renderItem = ({ item }: { item: FaqItem }) => {
    //const itemStats = stats ? stats[item.id] : { up: 0, down: 0 };
    return (
      <AccordionItem
        title={t(item.questionKey.replace('.', ':'))}
        style={styles.accordionContainer}
      >
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>
            {t(item.answerKey.replace('.', ':'))}
          </Text>
          {/* ✨ 3. AÑADIMOS EL COMPONENTE DE FEEDBACK */}
          <FeedbackButtons
            questionId={item.id}
            submitFeedback={submitFeedback}
            hasVoted={hasVoted(item.id)}
            onVote={registerVote}
          />
        </View>
      </AccordionItem>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator style={styles.centered} />;
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
    if (categoryQuestions.length === 0) {
      return (
        <EmptyState
          message={t('common:errors.noDataAvailable')}
          icon={
            <IconFactory
              name="Question"
              size={40}
              color={COLORS.secondaryText}
            />
          }
          style={styles.centered}
        />
      );
    }
    return (
      <FlatList
        data={categoryQuestions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        title={t(categoryTitleKey.replace('.', ':'))}
        showBackButton
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryBackground },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  answerContainer: {
    padding: moderateScale(16),
  },
  listContent: { padding: moderateScale(20) },
  accordionContainer: { marginBottom: verticalScale(12) },
  answerText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    lineHeight: moderateScale(22),
  },
});

export default QAScreen;
