import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton'; // Asumo que tienes un componente base de Skeleton
import { scale, verticalScale, moderateScale } from '../../utils/scaling';

const QuickFilterSkeleton = () => (
  <View style={styles.grid}>
    {Array.from({ length: 6 }).map((_, index) => (
      <View key={index} style={styles.card}>
        <Skeleton style={styles.icon} />
        <Skeleton style={styles.text} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(30),
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(15),
  },
  icon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(8),
  },
  text: {
    width: '80%',
    height: verticalScale(16),
    borderRadius: moderateScale(4),
  },
});

export default QuickFilterSkeleton;
