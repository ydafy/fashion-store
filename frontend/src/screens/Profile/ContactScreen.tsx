import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { PaperPlaneRightIcon } from 'phosphor-react-native';

// --- Lógica y Hooks ---
import { useAuth } from '../../contexts/AuthContext';
import { useChatbot } from '../../hooks/useChatbot';
import * as loggingService from '../../services/logging';

// --- Componentes y Constantes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

const AI_USER = {
  _id: 2,
  name: 'Support Bot',
};

const ContactScreen = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { mutate: getAiResponse, isPending } = useChatbot();
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = verticalScale(10) + insets.top;

  const currentUser = {
    _id: user?.id || 1,
    name: user?.name || 'You',
  };

  useEffect(() => {
    setMessages([
      {
        _id: uuidv4(),
        text: t('help.chatWelcome'),
        createdAt: new Date(),
        user: AI_USER,
      },
    ]);
  }, [t]);

  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      const userMessage = newMessages[0];
      const messageHistory = [...messages].reverse();
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [userMessage]),
      );

      //LLAMAMOS A LA IA Y AL LOGGING
      getAiResponse(
        {
          question: userMessage.text,
          history: messageHistory,
        },
        {
          onSuccess: (aiText) => {
            const aiMessage: IMessage = {
              _id: uuidv4(),
              text: aiText,
              createdAt: new Date(),
              user: AI_USER,
            };
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [aiMessage]),
            );
          },
          onError: (error) => {
            console.error('[ContactScreen] AI Error:', error);
            const errorMessage: IMessage = {
              _id: uuidv4(),
              text: t('common:errors.genericError'),
              createdAt: new Date(),
              user: AI_USER,
            };
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [errorMessage]),
            );
          },
        },
      );

      // Registramos la pregunta del usuario (dispara y olvida)
      loggingService.logUserQuestion(userMessage.text);
    },

    [getAiResponse, t, messages],
  );

  // Componente personalizado para el botón de enviar
  const renderSend = (props: any) => (
    <Send {...props} disabled={isPending || !props.text}>
      <View style={styles.sendContainer}>
        <PaperPlaneRightIcon
          size={24}
          color={COLORS.primaryText}
          weight="fill"
        />
      </View>
    </Send>
  );

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('help.contactUs')} showBackButton />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={HEADER_HEIGHT}
          >
            <GiftedChat
              messages={messages}
              onSend={(msgs) => onSend(msgs)}
              user={{ _id: currentUser._id }}
              placeholder={t('help.chatPlaceholder')}
              isTyping={isPending}
              renderSend={renderSend}
              messagesContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground, // El color del header y el fondo
  },
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  messagesContainer: {},
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginRight: 15,
  },
});

export default ContactScreen;
