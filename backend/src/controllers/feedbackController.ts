import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

interface FeedbackStats {
  [questionId: string]: {
    up: number;
    down: number;
  };
}

const feedbackFilePath = path.resolve(
  __dirname,
  '../../src/data/faq_feedback.json'
);

export const submitFaqFeedback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { questionId, vote } = req.body;

    if (!questionId || !['up', 'down'].includes(vote)) {
      res
        .status(400)
        .json({
          message: 'questionId and vote ("up" or "down") are required.'
        });
      return;
    }

    let feedbacks: FeedbackStats = {}; // ✨ Usamos nuestro nuevo tipo
    try {
      const fileContent = await fs.readFile(feedbackFilePath, 'utf-8');
      if (fileContent) {
        feedbacks = JSON.parse(fileContent);
      }
    } catch (readError) {
      /* El archivo está vacío o no existe, empezamos con un objeto vacío */
    }

    // Si la pregunta no existe en nuestro objeto, la inicializamos.
    if (!feedbacks[questionId]) {
      feedbacks[questionId] = { up: 0, down: 0 };
    }

    // Incrementamos el contador correspondiente.
    if (vote === 'up') {
      feedbacks[questionId].up += 1;
    } else if (vote === 'down') {
      feedbacks[questionId].down += 1;
    }

    await fs.writeFile(feedbackFilePath, JSON.stringify(feedbacks, null, 2));

    console.log('[FeedbackController] Received FAQ feedback:', {
      questionId,
      vote
    });
    res.status(202).send();
  } catch (error) {
    console.error('[FeedbackController] Error saving feedback:', error);
    res.status(500).send();
  }
};

export const getFaqStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fileContent = await fs.readFile(feedbackFilePath, 'utf-8');
    const stats = JSON.parse(fileContent);
    res.status(200).json(stats);
  } catch (error) {
    res.status(200).json({});
  }
};
