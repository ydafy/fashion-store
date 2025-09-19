import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface OnSaleFilterProps {
  isOnSale: boolean;
  onToggle: (newValue: boolean) => void;
}

const OnSaleFilter: React.FC<OnSaleFilterProps> = ({ isOnSale, onToggle }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('shop:filters.onSaleTitle')}</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>{t('shop:filters.onSaleLabel')}</Text>
        <Switch
          trackColor={{ false: COLORS.lightGray, true: COLORS.delivered }}
          thumbColor={isOnSale ? COLORS.white : COLORS.primaryText}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggle}
          value={isOnSale}
        />
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText
  }
});

export default OnSaleFilter;
