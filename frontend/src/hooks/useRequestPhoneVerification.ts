import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import * as authService from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { ProfileStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../types/auth';

interface VerificationPayload {
  phoneNumber: string;
  countryCode: string;
  callingCode: string;
}
export const useRequestPhoneVerification = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  return useMutation({
    mutationFn: (payload: VerificationPayload): Promise<User> => {
      // ✨ AÑADIDO tipo
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      // ✨ AÑADIDO countryCode
      return authService.requestPhoneVerification(user.id, payload);
    },
    onSuccess: (updatedUser: User) => {
      // ✨ CAMBIO
      updateUser(updatedUser); // ✨ PASO CLAVE: Actualizamos el estado global

      Toast.show({
        type: 'success',
        text1: t('auth:alerts.phoneVerificationSentTitle'),
        text2: t('auth:alerts.phoneVerificationSent'),
      });
      navigation.goBack();
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: t('common:error'),
        text2: t('auth:alerts.genericError'),
      });
    },
  });
};
