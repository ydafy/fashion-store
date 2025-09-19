import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ApiSizeOption } from '../../types/api';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface SizeFilterProps {
  sizes: ApiSizeOption[];
  selectedSizes: string[];
  onSizeSelect: (sizeValue: string) => void;
}

const SizeFilter: React.FC<SizeFilterProps> = ({
  sizes,
  selectedSizes,
  onSizeSelect
}) => {
  const { t } = useTranslation();
  if (sizes.length === 0) return null;

  return (
    <View style={styles.filterSection}>
      <Text style={styles.title}>{t('shop:filters.sizeTitle')}</Text>
      <View style={styles.optionsContainer}>
        {sizes.map((size) => {
          const isSelected = selectedSizes.includes(size.value);
          return (
            <TouchableOpacity
              key={size.value}
              style={[styles.button, isSelected && styles.selectedButton]}
              onPress={() => onSizeSelect(size.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.selectedButtonText
                ]}
              >
                {size.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    paddingVertical: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    marginTop: verticalScale(10)
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
    borderRadius: moderateScale(8),
    marginRight: scale(10),
    marginBottom: verticalScale(10),
    minWidth: moderateScale(48), // Ancho mínimo para tallas pequeñas
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedButton: {
    backgroundColor: COLORS.primaryText
  },
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '500'
  },
  selectedButtonText: {
    color: COLORS.white
  }
});

export default SizeFilter;
