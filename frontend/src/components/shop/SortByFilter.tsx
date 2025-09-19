import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';
import { SortOption } from '../../hooks/useProductSearch';

// Definimos las opciones de ordenamiento y sus claves de traducción
const SORT_OPTIONS = [
  { key: 'relevance', labelKey: 'shop:filters.sortBy.relevance' },
  { key: 'price-asc', labelKey: 'shop:filters.sortBy.priceAsc' },
  { key: 'price-desc', labelKey: 'shop:filters.sortBy.priceDesc' }
  // Podríamos añadir 'newest' si tuviéramos una fecha en los productos
];

interface SortByFilterProps {
  selectedSortBy: SortOption;
  onSelectSortBy: (option: SortOption) => void;
}

const SortByFilter: React.FC<SortByFilterProps> = ({
  selectedSortBy,
  onSelectSortBy
}) => {
  const { t } = useTranslation();

  const handleSelect = (key: string) => {
    if (key === 'relevance') {
      onSelectSortBy(null);
    } else if (key === 'price-asc') {
      onSelectSortBy({ field: 'price', order: 'asc' });
    } else if (key === 'price-desc') {
      onSelectSortBy({ field: 'price', order: 'desc' });
    }
  };

  // Determina la clave seleccionada actualmente para la UI
  let currentSelectedKey = 'relevance';
  if (selectedSortBy) {
    if (selectedSortBy.field === 'price' && selectedSortBy.order === 'asc') {
      currentSelectedKey = 'price-asc';
    } else if (
      selectedSortBy.field === 'price' &&
      selectedSortBy.order === 'desc'
    ) {
      currentSelectedKey = 'price-desc';
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('shop:filters.sortBy.title')}</Text>
      <View style={styles.optionsContainer}>
        {SORT_OPTIONS.map((option) => {
          const isSelected = currentSelectedKey === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.button, isSelected && styles.selectedButton]}
              onPress={() => handleSelect(option.key)}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.selectedButtonText
                ]}
              >
                {t(option.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    marginTop: moderateScale(10)
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(12)
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  button: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(10),
    marginBottom: moderateScale(10)
  },
  selectedButton: {
    backgroundColor: COLORS.primaryText
  },
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText
  },
  selectedButtonText: {
    color: COLORS.white
  }
});

export default SortByFilter;
