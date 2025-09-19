import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';

interface SkeletonProps {
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ style }) => {
  const progress = useSharedValue(0.5);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.lightGray, COLORS.separator], // Anima entre dos tonos de gris
    );
    return { backgroundColor };
  });

  return <Animated.View style={[styles.skeleton, animatedStyle, style]} />;
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.lightGray, // Color base
  },
});
