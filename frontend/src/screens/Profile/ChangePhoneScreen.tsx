import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

// --- Lógica y Tipos ---
import {
  createChangePhoneSchema,
  ChangePhoneFormData,
} from '../../components/schemas/changePhoneSchema';
import { useAuth } from '../../contexts/AuthContext';
import { useRequestPhoneVerification } from '../../hooks/useRequestPhoneVerification';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import StyledPhoneInput from '../../components/common/inputs/StyledPhoneInput';
import Checkbox from '../../components/common/Checkbox';
import AuthButton from '../../components/auth/AuthButton';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

const ChangePhoneScreen = () => {
  const { t } = useTranslation(['profile', 'errors']);
  const { user } = useAuth();
  const { mutate: requestVerification, isPending } =
    useRequestPhoneVerification();

  const hasPhone = !!user?.phone;

  const currentUserPhone = useMemo(() => {
    if (!user?.phone?.callingCode || !user.phone.number) return undefined;
    return `+${user.phone.callingCode} ${user.phone.number}`; // Añadí un espacio para legibilidad
  }, [user?.phone]);

  const changePhoneSchema = useMemo(
    () => createChangePhoneSchema(user?.phone),
    [user?.phone],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ChangePhoneFormData>({
    resolver: zodResolver(changePhoneSchema),
    mode: 'onChange',
    defaultValues: {
      phone: {
        number: user?.phone?.number || '',
        countryCode: user?.phone?.countryCode || 'US',
        callingCode: user?.phone?.callingCode || '1',
        isValid: hasPhone,
      },
      consent: false,
    },
  });

  const onSubmit = (data: ChangePhoneFormData) => {
    const payload = {
      phoneNumber: data.phone.number,
      countryCode: data.phone.countryCode,
      callingCode: data.phone.callingCode,
    };

    requestVerification(payload);
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        title={t(
          hasPhone ? 'settings.editPhoneTitle' : 'settings.addPhoneTitle',
        )}
        showBackButton
      />
      <View style={styles.content}>
        {hasPhone && (
          <Text style={styles.currentPhoneText}>
            {t('settings.currentPhoneLabel')}
            <Text style={styles.phoneValue}> {currentUserPhone}</Text>
          </Text>
        )}

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledPhoneInput
              label={t('settings.newPhoneLabel')}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              errorMessage={
                errors.phone?.message ? t(errors.phone.message) : undefined
              }
            />
          )}
        />

        <Controller
          control={control}
          name="consent"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              label={t('settings.consentCheckboxLabel')}
              isChecked={value}
              onPress={() => onChange(!value)}
              containerStyle={styles.checkboxContainer}
            />
          )}
        />
        {errors.consent?.message && (
          <Text style={styles.errorText}>{t(errors.consent.message)}</Text>
        )}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimer}>{t('settings.disclaimerText')}</Text>
        </View>

        <AuthButton
          title={t('settings.sendCodeButton')}
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          disabled={!isValid || isPending}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryBackground },
  content: { padding: moderateScale(20) },

  currentPhoneText: {
    fontSize: moderateScale(16),
    color: COLORS.secondaryText,
    marginBottom: verticalScale(24),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  phoneValue: {
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  checkboxContainer: {
    marginVertical: verticalScale(16),
  },
  disclaimerContainer: {
    paddingVertical: verticalScale(10),
  },
  disclaimer: {
    fontSize: moderateScale(12),
    color: COLORS.secondaryText,
    lineHeight: moderateScale(18),
  },
  button: {
    marginTop: 'auto',
    marginBottom: verticalScale(20),
  },
  errorText: {
    color: COLORS.error,
    fontSize: moderateScale(12),
    marginTop: verticalScale(-12),
    marginBottom: verticalScale(12),
  },
});

export default ChangePhoneScreen;
