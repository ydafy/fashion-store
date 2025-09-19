import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Toast from 'react-native-toast-message';
import {
  GoogleLogoIcon,
  FacebookLogoIcon,
  SignInIcon,
} from 'phosphor-react-native';

// --- Lógica y Tipos ---
import { useAuth } from '../../contexts/AuthContext';
import { LoginScreenProps } from '../../types/navigation';
import {
  loginSchema,
  LoginFormData,
} from '../../components/schemas/authSchemas';

// --- Componentes ---
import DynamicBrandText from '../../components/auth/DynamicBrandText';
import AuthScreenContainer from '../../components/auth/AuthScreenContainer';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthLink from '../../components/common/AuthLink';
// ✨ REFACTOR: Importamos nuestro nuevo componente de contraseña
import PasswordTextInput from '../../components/common/inputs/PasswordTextInput';
import { scale, verticalScale, moderateScale } from '../../utils/scaling';

// --- Constantes ---
import { COLORS } from '../../constants/colors';

const BRAND_PHRASES = [
  "WOMEN'S CLOTHING",
  'Style 2050',
  'From Paris',
  'Girls Fancy',
  'Modern Grace',
  'Timeless Fashion',
  '1639',
];

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(['auth', 'common']); // Añadimos 'common'
  const auth = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  // ✨ REFACTOR: Eliminado el useState de isPasswordVisible
  const passwordInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (auth.error) {
      Toast.show({
        type: 'error',
        text1: t('auth:alerts.loginErrorTitle'),
        text2: auth.error, // Usamos el error ya traducido del contexto
      });
      auth.clearAuthError();
    }
  }, [auth, t]);

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    await auth.login(data.email, data.password);
  };

  const handleSocialLoginPress = async (provider: 'google' | 'facebook') => {
    if (auth.isLoading) return;
    await auth.simulateSocialLogin(provider);
  };

  return (
    <AuthScreenContainer>
      <DynamicBrandText
        texts={BRAND_PHRASES}
        interval={3500}
        textStyle={styles.brandTextStyle}
        containerStyle={styles.brandTextContainerStyle}
      />

      <View style={styles.formContainer}>
        {/* Campo Email */}
        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <StyledTextInput
              label={t('emailLabel')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('emailPlaceholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              errorMessage={error ? t(error.message as string) : undefined}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          )}
        />

        <View style={styles.passwordHeaderContainer}>
          <Text style={styles.passwordLabel}>{t('passwordLabel')}</Text>
          <AuthLink
            text={t('forgotPasswordLink')}
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordLink}
          />
        </View>

        {/* Campo Contraseña */}
        <Controller
          control={control}
          name="password"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            // ✨ REFACTOR: Reemplazamos StyledTextInput por PasswordTextInput
            <PasswordTextInput
              ref={passwordInputRef}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('passwordPlaceholder')}
              errorMessage={error ? t(error.message as string) : undefined}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
            />
          )}
        />

        <AuthButton
          title={t('loginButton')}
          onPress={handleSubmit(onSubmit)}
          isLoading={formIsSubmitting || auth.isLoading}
          disabled={!isValid || formIsSubmitting || auth.isLoading}
          icon={
            <SignInIcon
              size={20}
              color={COLORS.primaryBackground}
              weight="bold"
            />
          }
        />

        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>{t('orLoginWith')}</Text>
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLoginPress('google')}
              disabled={auth.isLoading}
            >
              <GoogleLogoIcon size={28} weight="bold" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, { marginLeft: 15 }]}
              onPress={() => handleSocialLoginPress('facebook')}
              disabled={auth.isLoading}
            >
              <FacebookLogoIcon size={30} weight="fill" color="#1877F2" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.noAccountText}>{t('noAccountPrompt')}</Text>
        <AuthLink
          text={t('signUpLinkText')}
          onPress={() => navigation.navigate('Register')}
          style={styles.signUpLink}
        />
      </View>
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  brandTextStyle: {
    fontSize: moderateScale(36),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  brandTextContainerStyle: {
    marginVertical: verticalScale(30),
    height: verticalScale(50),
  },
  formContainer: {
    width: '100%',
  },
  passwordHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  passwordLabel: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  forgotPasswordLink: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(25),
    paddingBottom: verticalScale(10),
  },
  noAccountText: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginRight: scale(5),
  },
  signUpLink: {
    fontSize: moderateScale(15),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  socialLoginContainer: {
    alignItems: 'center',
    marginTop: verticalScale(25),
    marginBottom: verticalScale(20),
  },
  socialLoginText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(15),
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    width: scale(70), // ✨ APLICADO
    height: verticalScale(50),
    marginLeft: scale(15),
  },
});

export default LoginScreen;
