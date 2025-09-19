import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale } from '../../utils/scaling';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1.05 : 1) }]
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.chip, isSelected && styles.selectedChip]}
        onPress={onPress}
      >
        <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(20),
    marginRight: scale(10),
    borderWidth: 1.5,
    borderColor: 'transparent'
  },
  selectedChip: {
    backgroundColor: COLORS.primaryText,
    borderColor: COLORS.primaryText
  },
  chipText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '500'
  },
  selectedChipText: {
    color: COLORS.white
  }
});

export default FilterChip;
