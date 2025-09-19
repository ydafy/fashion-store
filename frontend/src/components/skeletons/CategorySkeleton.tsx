import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

const CategorySkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.icon} />
      <View style={styles.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white, // O el color de fondo de tu acordeón
    padding: moderateScale(15),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(10)
  },
  icon: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: COLORS.lightGray,
    marginRight: scale(12)
  },
  text: {
    width: '70%',
    height: moderateScale(20),
    borderRadius: moderateScale(4),
    backgroundColor: COLORS.lightGray
  }
});

export default CategorySkeleton;
