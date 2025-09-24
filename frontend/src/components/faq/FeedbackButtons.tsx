import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThumbsUpIcon, ThumbsDownIcon } from 'phosphor-react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { COLORS } from '../../constants/colors';
import { moderateScale, scale } from '../../utils/scaling';
import { FaqFeedbackPayload } from '../../services/feedback';

interface FeedbackButtonsProps {
  questionId: string;
  submitFeedback: (payload: FaqFeedbackPayload) => void;
  hasVoted: boolean;
  onVote: (questionId: string) => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  questionId,
  submitFeedback,
  hasVoted,
  onVote,
}) => {
  const { t } = useTranslation('faq');

  const thumbUpScale = useSharedValue(1);
  const thumbDownScale = useSharedValue(1);
  const thumbUpOpacity = useSharedValue(1);
  const thumbDownOpacity = useSharedValue(1);

  const animatedThumbUpStyle = useAnimatedStyle(() => ({
    opacity: thumbUpOpacity.value,
    transform: [{ scale: thumbUpScale.value }],
  }));
  const animatedThumbDownStyle = useAnimatedStyle(() => ({
    opacity: thumbDownOpacity.value,
    transform: [{ scale: thumbDownScale.value }],
  }));

  const handleVote = (vote: 'up' | 'down') => {
    // a) The security guard: uses the 'hasVoted' prop from our persistent memory.
    if (hasVoted) return;

    // b) Immediate feedback: haptic and call to the backend.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitFeedback({ questionId, vote });

    // c) Helper to call our memory function from the UI thread.
    const registerVoteOnJS = () => {
      'worklet';
      runOnJS(onVote)(questionId);
    };

    // d) The animation logic.
    if (vote === 'up') {
      thumbUpScale.value = withSpring(
        1.4,
        { damping: 15, stiffness: 150 },
        () => {
          thumbUpScale.value = withSpring(1);
        },
      );
      thumbDownOpacity.value = withTiming(0, { duration: 400 });
      thumbDownScale.value = withTiming(0.5, { duration: 400 }, () => {
        registerVoteOnJS();
      });
    } else {
      thumbDownScale.value = withSpring(
        1.4,
        { damping: 15, stiffness: 150 },
        () => {
          thumbDownScale.value = withSpring(1);
        },
      );
      thumbUpOpacity.value = withTiming(0, { duration: 400 });
      thumbUpScale.value = withTiming(0.5, { duration: 400 }, () => {
        registerVoteOnJS();
      });
    }
  };

  //  JSX is based on 'hasVoted'
  if (hasVoted) {
    return (
      <View style={styles.container}>
        <Text style={styles.promptText}>{t('feedbackThanks')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>{t('feedbackPrompt')}</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleVote('up')}
        >
          <Animated.View style={animatedThumbUpStyle}>
            <ThumbsUpIcon size={moderateScale(22)} color={COLORS.delivered} />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleVote('down')}
        >
          <Animated.View style={animatedThumbDownStyle}>
            <ThumbsDownIcon size={moderateScale(22)} color={COLORS.error} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: moderateScale(20),
    paddingTop: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: moderateScale(50),
  },
  promptText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  button: {
    padding: scale(8),
    marginLeft: scale(12),
  },
});

export default FeedbackButtons;
