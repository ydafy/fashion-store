import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

// --- Lógica y Tipos ---
import {
  createChangeEmailSchema,
  ChangeEmailFormData,
} from '../../components/schemas/changeEmailSchema';
import { useAuth } from '../../contexts/AuthContext';

import { useChangeEmail } from '../../hooks/useChangeEmail';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import AuthButton from '../../components/auth/AuthButton';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

const ChangeEmailScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutate: changeEmail, isPending } = useChangeEmail();

  // Creamos el schema dinámicamente, pasándole el email actual del usuario.
  const changeEmailSchema = useMemo(
    () => createChangeEmailSchema(user?.email || ''),
    [user?.email],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: ChangeEmailFormData) => {
    changeEmail(data.newEmail);
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('header:changeEmail')} showBackButton />
      <View style={styles.content}>
        <Text style={styles.currentEmailText}>
          {t('profile:settings.currentEmailLabel')}
          <Text style={styles.emailValue}> {user?.email}</Text>
        </Text>

        <Controller
          control={control}
          name="newEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              label={t('profile:settings.newEmailLabel')}
              placeholder="example@email.com"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.newEmail?.message
                  ? t(errors.newEmail.message)
                  : undefined
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              label={t('profile:settings.confirmEmailLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.confirmEmail?.message
                  ? t(errors.confirmEmail.message)
                  : undefined
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <AuthButton
          title={t('common:change')}
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending} // ✨ Usamos isPending de TanStack Query
          disabled={!isValid || isPending} // ✨ Usamos isPending aquí también
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryBackground },
  content: { padding: moderateScale(20) },
  currentEmailText: {
    fontSize: moderateScale(16),
    color: COLORS.secondaryText,
    marginBottom: verticalScale(24),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  emailValue: {
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  button: {
    marginTop: verticalScale(20),
  },
});

export default ChangeEmailScreen;
