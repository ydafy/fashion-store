import React from 'react';
import { View, Text, StyleSheet, Alert, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData
} from '../../components/schemas/authSchemas'; // Ajusta ruta

// Context
import { useAuth } from '../../contexts/AuthContext';
// Types
import { ForgotPasswordScreenProps } from '../../types/navigation';
// Components
import AuthScreenContainer from '../../components/auth/AuthScreenContainer';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import AuthButton from '../../components/auth/AuthButton';
// Constants
import { COLORS } from '../../constants/colors';
import { scale, verticalScale, moderateScale } from '../../utils/scaling';

// TODO: Definir ForgotPasswordScreenProps en types/navigation.ts si es necesario
// export interface ForgotPasswordScreenProps extends NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'> {}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation
}) => {
  const { t } = useTranslation();
  const { requestPasswordReset, isLoading, error, clearAuthError } = useAuth(); // Asumimos que requestPasswordReset existirá

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting: formIsSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onTouched'
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    Keyboard.dismiss();
    if (clearAuthError) clearAuthError(); // Limpiar errores previos del contexto

    try {
      const success = await requestPasswordReset(data.email); // Llamar a la función del contexto
      if (success) {
        Alert.alert(
          t('auth:alerts.passwordResetRequestedTitle'),
          t('auth:alerts.passwordResetRequestedMessage'), // Este mensaje ya es una clave i18n
          [{ text: t('common:ok'), onPress: () => navigation.goBack() }]
        );
      }
      // El 'else' o manejo de error específico de requestPasswordReset se haría si la función devuelve false
      // o si lanza un error que no sea el genérico ya manejado por el try/catch.
      // Por ahora, si requestPasswordReset lanza error, el catch de abajo lo manejará.
    } catch (err: any) {
      Alert.alert(
        t('auth:alerts.passwordResetErrorTitle'), // Título del Alert traducido
        err.message // Usar directamente err.message
      );
    }
  };

  return (
    <AuthScreenContainer>
      <Text style={styles.title}>{t('auth:forgotPasswordTitle')}</Text>
      <Text style={styles.instructions}>
        {t('auth:forgotPasswordInstructions')}
      </Text>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error: fieldError }
          }) => (
            <StyledTextInput
              label={t('auth:emailLabel')}
              inputKey="email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('auth:emailPlaceholder', 'Ingresa tu correo')}
              keyboardType="email-address"
              autoCapitalize="none"
              errorMessage={
                fieldError ? t(fieldError.message as string) : undefined
              }
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />

        <AuthButton
          title={t('auth:sendResetLinkButton')}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading || formIsSubmitting} // isLoading del contexto y de RHF
          disabled={!isValid || isLoading || formIsSubmitting}
          style={styles.submitButton}
        />
      </View>
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: moderateScale(24),
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: verticalScale(15)
  },
  instructions: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    textAlign: 'center',
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(20),
    lineHeight: verticalScale(22)
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: scale(5) // Similar a RegisterScreen
  },
  submitButton: {
    marginTop: verticalScale(20)
  }
});

export default ForgotPasswordScreen;
