import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getDocument = (req: Request, res: Response): void => {
  try {
    const { documentType } = req.params;

    if (!/^[a-zA-Z0-9]+$/.test(documentType)) {
      res.status(400).json({ message: 'Invalid document type requested.' });
      return;
    }

    const filePath = path.join(__dirname, `../../content/${documentType}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    res.status(200).json({ content });
  } catch (error) {
    console.error(`[DocumentController] Error reading document:`, error);
    res.status(404).json({ message: 'Document not found.' });
  }
};
