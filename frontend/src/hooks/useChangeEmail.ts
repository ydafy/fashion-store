import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import * as authService from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';

/**
 * @description Hook para manejar la lógica de la mutación de cambio de email.
 * Centraliza el estado de carga, los errores y los efectos secundarios (toasts, navegación).
 */
export const useChangeEmail = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  return useMutation({
    mutationFn: (newEmail: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return authService.requestEmailChange(user.id, newEmail);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: t('auth:alerts.emailChangeRequested'),
      });
      navigation.goBack(); // Ahora TypeScript entiende perfectamente esta llamada
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
