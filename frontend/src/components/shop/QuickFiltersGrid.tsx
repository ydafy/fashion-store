import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useFeaturedQuickFilters } from '../../hooks/useFeaturedQuickFilters';
import { RootStackParamList } from '../../types/navigation';
import { IconFactory } from '../icons/IconFactory';
import QuickFilterSkeleton from '../skeletons/QuickFilterSkeleton';
import { COLORS } from '../../constants/colors';
import { scale, verticalScale, moderateScale } from '../../utils/scaling';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../common/SectionHeader';

const QuickFiltersGrid: React.FC = () => {
  const { data: filters, status } = useFeaturedQuickFilters();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation('shop');

  const handleFilterPress = (filter: { id: string; title: string }) => {
    navigation.navigate('MainTabs', {
      screen: 'ComprarTab',
      params: {
        screen: 'Section',
        params: {
          title: filter.title,
          filterPayload: { tags: [filter.id] },
        },
      },
    });
  };

  if (status === 'pending') {
    return <QuickFilterSkeleton />;
  }
  if (status === 'error' || !filters) {
    return null; // O un componente de error pequeño
  }

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader title={t('quickFilters.title')} />

      <View style={styles.grid}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={styles.card}
            onPress={() => handleFilterPress(filter)}
            accessibilityRole="button"
            accessibilityLabel={filter.title}
          >
            <IconFactory
              name={filter.iconName}
              size={moderateScale(32)}
              color={COLORS.primaryText}
            />
            <Text style={styles.text}>{filter.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
  },
  sectionContainer: {},

  card: {
    width: '30%',
    aspectRatio: 1, // Para que sea un cuadrado perfecto
    backgroundColor: COLORS.separator,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(15),
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  text: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
  },
});

export default QuickFiltersGrid;
