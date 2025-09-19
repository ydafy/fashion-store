import { Request, Response } from 'express';
import * as chatService from '../services/chat.service';

export const handleChatQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ✨ Recibimos 'question' y 'history' del body
    const { question, history } = req.body;
    if (!question) {
      res.status(400).json({ error: 'Question is required.' });
      return;
    }

    // ✨ Pasamos ambos al servicio
    const aiResponse = await chatService.getAiChatResponse(
      question,
      history || []
    );
    res.status(200).json({ answer: aiResponse });
  } catch (error) {
    console.error('[ChatController] Error:', error);
    res.status(500).json({ error: 'An internal error occurred.' });
  }
};
