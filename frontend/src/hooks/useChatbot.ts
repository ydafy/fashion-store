import { useMutation } from '@tanstack/react-query';
import { IMessage } from 'react-native-gifted-chat';
import * as chatService from '../services/chat';

export interface ChatPayload {
  question: string;
  history: IMessage[];
}

export const useChatbot = () => {
  return useMutation({
    mutationFn: (payload: ChatPayload) =>
      chatService.getChatbotResponse(payload),
  });
};
