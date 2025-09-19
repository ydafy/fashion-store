import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as feedbackService from '../services/feedback';
import { FaqFeedbackPayload } from '../services/feedback';

export const useSubmitFaqFeedback = () => {
  // Obtenemos acceso al cliente de TanStack Query
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FaqFeedbackPayload) =>
      feedbackService.submitFaqFeedback(payload),

    // Cuando la mutación (el voto) tiene éxito...
    onSuccess: () => {
      // ...le decimos a TanStack Query que los datos con la clave 'faqStats'
      // están obsoletos. La próxima vez que se necesiten, los volverá a pedir.
      queryClient.invalidateQueries({ queryKey: ['faqStats'] });
    },
    onError: (error) => {
      console.error('Failed to submit FAQ feedback:', error);
    },
  });
};
