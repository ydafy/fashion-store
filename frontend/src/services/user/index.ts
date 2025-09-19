import { API_BASE_URL } from '../../config/api';
import { User } from '../../types/auth';
import { EditProfileFormData } from '../../components/schemas/editProfileSchema';

export interface UpdateProfilePayload extends EditProfileFormData {
  avatarUrl?: string;
}

interface UpdateProfileResponse {
  user: User;
}

export const updateUserProfile = async (
  userId: string,
  payload: UpdateProfilePayload,
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...payload }),
  });

  if (!response.ok) {
    // Aquí podrías usar un manejador de errores más robusto si lo necesitas
    throw new Error('Failed to update profile.');
  }

  const data: UpdateProfileResponse = await response.json();
  return data.user;
};
