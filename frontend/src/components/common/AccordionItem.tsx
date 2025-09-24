import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  measure,
  runOnUI,
  useAnimatedRef,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  style?: StyleProp<ViewStyle>;

  // We accept a full React element, not just the icon name.
  icon?: React.ReactElement | null;
  titleStyle?: StyleProp<TextStyle>;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  initiallyOpen = false,
  style,
  icon,
  titleStyle,
}) => {
  const { t } = useTranslation();
  const contentRef = useAnimatedRef<Animated.View>();
  const openProgress = useSharedValue(initiallyOpen ? 1 : 0);
  const heightValue = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${openProgress.value * 180}deg` }],
  }));

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
  }));

  const toggleAccordion = () => {
    if (heightValue.value === 0) {
      runOnUI(() => {
        'worklet';
        const contentHeight = measure(contentRef)?.height || 0;
        heightValue.value = withSpring(contentHeight, {
          damping: 14,
          stiffness: 120,
        });
      })();
    } else {
      heightValue.value = withTiming(0, { duration: 250 });
    }
    openProgress.value = withTiming(openProgress.value === 0 ? 1 : 0, {
      duration: 250,
    });
  };

  const accessibilityLabel = `${title}, ${t(
    openProgress.value === 1 ? 'common:collapse' : 'common:expand',
  )}`;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleAccordion}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityState={{ expanded: openProgress.value === 1 }}
        accessibilityLabel={accessibilityLabel}
      >
        {/* --- MAJOR CHANGE: We render the icon directly --- */}
        {/* If the icon exists, we wrap it in a View to give it margin */}
        {icon && <View style={styles.leftIconWrapper}>{icon}</View>}
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        <Animated.View style={animatedIconStyle}>
          <Ionicons
            name="chevron-down-outline"
            size={moderateScale(24)}
            color={COLORS.primaryText}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.contentWrapper, animatedWrapperStyle]}>
        <Animated.View ref={contentRef} style={styles.contentInner}>
          {children}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryBackground,
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(10),
    borderBottomColor: COLORS.primaryText,
    borderBottomWidth: 1,
    overflow: 'hidden',
  },

  leftIconWrapper: {
    marginRight: scale(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(15),
  },
  titleText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '600',
    marginRight: scale(10),
  },
  contentWrapper: {
    overflow: 'hidden',
  },
  contentInner: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(15),
  },
});

export default AccordionItem;
