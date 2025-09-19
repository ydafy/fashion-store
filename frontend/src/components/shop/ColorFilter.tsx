import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check } from 'phosphor-react-native';
import { ApiColorOption } from '../../types/api';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface ColorFilterProps {
  colors: ApiColorOption[];
  selectedColors: string[];
  onColorSelect: (colorValue: string) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  colors,
  selectedColors,
  onColorSelect
}) => {
  const { t } = useTranslation();
  if (colors.length === 0) return null;

  return (
    <View style={styles.filterSection}>
      <Text style={styles.title}>{t('shop:filters.colorTitle')}</Text>
      <View style={styles.optionsContainer}>
        {colors.map((color) => {
          const isSelected = selectedColors.includes(color.value);
          return (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorCircle,
                { backgroundColor: color.hex },
                isSelected && styles.selectedCircle
              ]}
              onPress={() => onColorSelect(color.value)}
            >
              {isSelected && (
                <Check
                  size={moderateScale(18)}
                  color={COLORS.white}
                  weight="bold"
                />
              )}
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
  colorCircle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20), // Círculo perfecto
    marginRight: scale(12),
    marginBottom: verticalScale(12),
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedCircle: {
    borderColor: COLORS.primaryText
  }
});

export default ColorFilter;
