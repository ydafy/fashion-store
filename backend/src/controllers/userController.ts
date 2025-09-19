import { Request, Response } from 'express';
import * as userService from '../services/user.service'; // Crearemos esto ahora

export const updateUserProfile = (req: Request, res: Response): void => {
  // En un backend real, el userId vendría del token JWT decodificado.
  const { userId, name, birthDate, gender, avatarUrl } = req.body;

  if (!userId || !name) {
    res.status(400).json({ message: 'User ID and name are required.' });
    return;
  }

  const updatedUser = userService.updateUserProfile(userId, {
    name,
    birthDate,
    gender,
    avatarUrl
  });

  if (!updatedUser) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  const { password: _, ...userWithoutPassword } = updatedUser;
  res.status(200).json({ user: userWithoutPassword });
};
