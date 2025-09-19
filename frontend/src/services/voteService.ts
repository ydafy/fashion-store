import AsyncStorage from '@react-native-async-storage/async-storage';

const VOTED_QUESTIONS_KEY = '@voted_questions';

/**
 * @description Obtiene la lista de IDs de preguntas que el usuario ya ha votado.
 */
export const getVotedQuestions = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(VOTED_QUESTIONS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to get voted questions.', e);
    return [];
  }
};

/**
 * @description Añade el ID de una pregunta a la lista de preguntas votadas.
 */
export const addVotedQuestion = async (questionId: string): Promise<void> => {
  try {
    const currentVoted = await getVotedQuestions();
    if (!currentVoted.includes(questionId)) {
      const newVoted = [...currentVoted, questionId];
      await AsyncStorage.setItem(VOTED_QUESTIONS_KEY, JSON.stringify(newVoted));
    }
  } catch (e) {
    console.error('Failed to add voted question.', e);
  }
};
