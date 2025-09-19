import React from 'react'; // Quita 'useState' si ya no lo usas para 'voted'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThumbsUpIcon, ThumbsDownIcon } from 'phosphor-react-native';
// ✨ 1. Asegúrate de tener todos los imports necesarios
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

  // ✨ 2. La configuración de la animación se mantiene
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

  // ✨ 3. LA FUNCIÓN 'handleVote' COMPLETA Y FINAL
  const handleVote = (vote: 'up' | 'down') => {
    // a) La guarda de seguridad: usa la prop 'hasVoted' de nuestra memoria persistente.
    if (hasVoted) return;

    // b) Feedback inmediato: háptico y llamada al backend.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    submitFeedback({ questionId, vote });

    // c) Helper para llamar a nuestra función de memoria desde el hilo de UI.
    const registerVoteOnJS = () => {
      'worklet';
      runOnJS(onVote)(questionId);
    };

    // d) La lógica de animación.
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

  // ✨ 4. El JSX se basa en 'hasVoted'
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
