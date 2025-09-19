import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

const logFilePath = path.join(__dirname, '../../chat_logs.json');

export const logUserQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).send();
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      question: question
    };

    // Leemos el archivo actual, añadimos la nueva entrada y lo volvemos a escribir.
    // En un backend real, esto sería un INSERT en una base de datos.
    let logs = [];
    try {
      const fileContent = await fs.readFile(logFilePath, 'utf-8');
      logs = JSON.parse(fileContent);
    } catch (readError) {
      // El archivo no existe todavía, lo ignoramos.
    }

    logs.push(logEntry);
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));

    res.status(202).send(); // 202 Accepted: La petición se aceptó, pero no hay nada que devolver.
  } catch (error) {
    console.error('[LoggingController] Error:', error);
    res.status(500).send();
  }
};
