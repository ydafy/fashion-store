import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, verticalScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

const { width: screenWidth } = Dimensions.get('window');
const SKELETON_HEIGHT = verticalScale(450);

const HeroCarouselSkeleton = () => {
  return (
    <View style={styles.container}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        shimmerColors={[
          COLORS.borderDefault,
          COLORS.separator,
          COLORS.borderDefault,
        ]}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SKELETON_HEIGHT,
    backgroundColor: COLORS.separator,
    marginBottom: verticalScale(20),
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default HeroCarouselSkeleton;
