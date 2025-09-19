import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';
import { verticalScale, scale, moderateScale } from '../../utils/scaling';

const { width: screenWidth } = Dimensions.get('window');

const PromotionalHubSkeleton: React.FC = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.lightGray, COLORS.separator],
    );
    return { backgroundColor };
  });

  return (
    <View style={styles.sectionWrapper}>
      <Animated.View style={[styles.headerSkeleton, animatedStyle]} />
      <View style={styles.gridContainer}>
        <Animated.View style={[styles.largePanelSkeleton, animatedStyle]} />
        <View style={styles.rightColumn}>
          <Animated.View style={[styles.smallPanelSkeleton, animatedStyle]} />
          <Animated.View style={[styles.smallPanelSkeleton, animatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  headerSkeleton: {
    width: '50%',
    height: verticalScale(24),
    borderRadius: moderateScale(6),
    marginBottom: verticalScale(15),
  },
  gridContainer: {
    flexDirection: 'row',
    height: verticalScale(300),
  },
  largePanelSkeleton: {
    flex: 1.2,
    marginRight: scale(10),
    borderRadius: moderateScale(12),
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallPanelSkeleton: {
    height: '48%',
    borderRadius: moderateScale(12),
  },
});

export default PromotionalHubSkeleton;
