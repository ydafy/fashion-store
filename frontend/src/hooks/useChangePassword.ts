import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import * as authService from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { processUnknownError } from '../utils/errorUtils';

import { ChangePasswordFormData } from '../components/schemas/changePasswordSchema';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';

type ChangePasswordPayload = Omit<ChangePasswordFormData, 'confirmPassword'>;

export const useChangePassword = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['auth', 'common', 'errors']);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return authService.changePassword(user.id, payload);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: t('auth:alerts.passwordChangedSuccess'),
      });
      navigation.goBack();
    },
    // ✨ LA SOLUCIÓN COMPLETA ESTÁ AQUÍ ✨
    onError: (e: unknown) => {
      // 2. Usamos 'unknown' para cumplir con los estándares
      // 3. Usamos nuestra utilidad para procesar el error de forma segura
      const { messageKey, fallbackMessage } = processUnknownError(e);
      // 4. Reemplazamos el primer punto por dos puntos para crear la clave de i18next
      const i18nKey = messageKey.replace('.', ':');
      // 5. Traducimos usando la clave formateada
      const translatedMessage = t(i18nKey, fallbackMessage);

      Toast.show({
        type: 'error',
        text1: t('common:error'),
        text2: String(translatedMessage),
      });
    },
  });
};
