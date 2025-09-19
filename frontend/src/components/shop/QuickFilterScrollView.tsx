import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import QuickFilterButton from './QuickFilterButton';
import { FilterGroup, FilterOption } from '../../types/filter';
import { scale, verticalScale } from '../../utils/scaling';

interface QuickFilterScrollViewProps {
  quickFilterGroups: FilterGroup[];
  selectedTags: string[];
  onTagSelect: (tagValue: string | null) => void;
}

const QuickFilterScrollView: React.FC<QuickFilterScrollViewProps> = ({
  quickFilterGroups,
  selectedTags,
  onTagSelect
}) => {
  const { t } = useTranslation();

  if (!quickFilterGroups || quickFilterGroups.length === 0) {
    return null;
  }

  // Aplanamos todas las opciones en un solo array.
  const allOptions: FilterOption[] = quickFilterGroups.flatMap(
    (group) => group.options
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <QuickFilterButton
          label={t('common:all')}
          iconName="GridFour"
          isSelected={selectedTags.length === 0}
          onPress={() => onTagSelect(null)}
        />
        {allOptions.map((option) => (
          <QuickFilterButton
            key={option.value}
            label={option.name}
            iconName={option.iconName || 'Question'}
            isSelected={selectedTags.includes(option.value)}
            onPress={() => onTagSelect(option.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#F9F6EE'
  },
  scrollView: {
    paddingHorizontal: scale(15),
    alignItems: 'flex-start' // Cambiado a flex-start para alinear con el texto
  }
});

export default QuickFilterScrollView;
