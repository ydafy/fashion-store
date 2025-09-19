import { useState, useEffect, useCallback } from 'react';
import * as voteService from '../services/voteService';

export const useVoteManager = () => {
  const [votedQuestionIds, setVotedQuestionIds] = useState<string[]>([]);

  // Cargar los votos guardados al iniciar
  useEffect(() => {
    voteService.getVotedQuestions().then(setVotedQuestionIds);
  }, []);

  // Función para registrar un nuevo voto
  const registerVote = useCallback((questionId: string) => {
    setVotedQuestionIds((prev) => [...prev, questionId]);
    voteService.addVotedQuestion(questionId);
  }, []);

  // Función para comprobar si ya se ha votado
  const hasVoted = useCallback(
    (questionId: string) => {
      return votedQuestionIds.includes(questionId);
    },
    [votedQuestionIds],
  );

  return { hasVoted, registerVote };
};
