import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// --- Lógica y Tipos ---
import {
  changePasswordSchema,
  ChangePasswordFormData,
} from '../../components/schemas/changePasswordSchema';
import { useChangePassword } from '../../hooks/useChangePassword';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import PasswordTextInput from '../../components/common/inputs/PasswordTextInput';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import AuthButton from '../../components/auth/AuthButton';
import { COLORS } from '../../constants/colors';
import Checkbox from '../../components/common/Checkbox';
import { moderateScale, verticalScale } from '../../utils/scaling';

const ChangePasswordScreen = () => {
  const { t } = useTranslation([
    'profile',
    'errors',
    'passwordStrength',
    'common',
  ]);
  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    control,
    handleSubmit,
    watch, // Usamos watch para obtener el valor de la nueva contraseña en tiempo real
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange', // 'onChange' para que el feedback de fortaleza sea instantáneo
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      logoutOtherDevices: false,
    },
  });

  // Observamos el valor del campo 'newPassword' para pasarlo al indicador de fortaleza
  const newPasswordValue = watch('newPassword');

  const onSubmit = (data: ChangePasswordFormData) => {
    const { confirmPassword: _ignored, ...payload } = data;

    changePassword(payload);
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('settings.changePasswordTitle')} showBackButton />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordTextInput
              label={t('settings.currentPasswordLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.currentPassword?.message
                  ? t(errors.currentPassword.message)
                  : undefined
              }
              autoFocus
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordTextInput
              label={t('settings.newPasswordLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.newPassword?.message
                  ? t(errors.newPassword.message)
                  : undefined
              }
            />
          )}
        />
        {/* El indicador de fortaleza se renderiza aquí, fuera del Controller */}
        <PasswordStrengthIndicator password={newPasswordValue} />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordTextInput
              label={t('settings.confirmNewPasswordLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.confirmPassword?.message
                  ? t(errors.confirmPassword.message)
                  : undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="logoutOtherDevices"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              label={t('settings.logoutOtherDevicesCheckbox')}
              isChecked={value || false}
              onPress={() => onChange(!value)}
              containerStyle={styles.checkboxContainer}
            />
          )}
        />

        <AuthButton
          title={t('common:change')} // Usamos una clave más genérica
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          disabled={!isValid || isPending}
          style={styles.button}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  scrollContent: {
    padding: moderateScale(20),
  },
  checkboxContainer: {
    marginTop: verticalScale(10),
  },
  button: {
    marginTop: verticalScale(20),
  },
});

export default ChangePasswordScreen;
