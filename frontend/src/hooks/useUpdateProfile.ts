import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import * as userService from '../services/user';
import { useAuth } from '../contexts/AuthContext';
import { UpdateProfilePayload } from '../services/user';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';

export const useUpdateProfile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation('profile');
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return userService.updateUserProfile(user.id, payload);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser); // Actualizamos el estado global
      Toast.show({
        type: 'success',
        text1: t('alerts.profileUpdatedSuccess'),
      });
      navigation.goBack();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: t('common:error'),
        text2: t('common:genericError'),
      });
    },
  });
};
