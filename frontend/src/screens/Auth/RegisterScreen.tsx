import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { UserPlusIcon } from 'phosphor-react-native';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

// --- Lógica y Tipos ---
import { RegisterScreenProps } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  registerSchema,
  RegisterFormData,
} from '../../components/schemas/authSchemas';

// --- Componentes ---
import AuthScreenContainer from '../../components/auth/AuthScreenContainer';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthLink from '../../components/common/AuthLink';
import Checkbox from '../../components/common/Checkbox';
// ✨ REFACTOR: Importamos nuestros nuevos componentes de contraseña
import PasswordTextInput from '../../components/common/inputs/PasswordTextInput';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { scale, verticalScale, moderateScale } from '../../utils/scaling';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { t } = useTranslation([
    'auth',
    'errors',
    'passwordStrength',
    'common',
  ]);
  const auth = useAuth();

  // ✨ REFACTOR: Eliminamos los useState para la visibilidad de la contraseña
  // ya que ahora están encapsulados en PasswordTextInput.

  // Refs para el manejo del foco
  const emailInputRef = useRef<RNTextInput>(null);
  const passwordInputRef = useRef<RNTextInput>(null);
  const confirmPasswordInputRef = useRef<RNTextInput>(null);
  // ✨ REFACTOR: Eliminamos phoneInputRef

  const {
    control,
    handleSubmit,
    watch, // watch sigue siendo útil para el indicador de fortaleza
    formState: { errors, isSubmitting: formIsSubmitting, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    mode: 'onTouched',
  });

  // Observamos el valor de 'password' para el indicador de fortaleza
  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    Keyboard.dismiss();
    try {
      // ✨ REFACTOR: Llamamos a register sin el campo 'phone'.
      const success = await auth.register(data.name, data.email, data.password);

      if (success) {
        // ✨ REFACTOR: Usamos Toast para una UX consistente.
        Toast.show({
          type: 'success',
          text1: t('alerts.registrationSuccessTitle'),
          text2: t('alerts.registrationSuccessMessageVerifyEmail'),
          visibilityTime: 5000, // Damos más tiempo para leer
        });
        // La navegación la maneja el observer del estado de autenticación
      }
    } catch (error: any) {
      // ✨ REFACTOR: Usamos Toast para los errores.
      Toast.show({
        type: 'error',
        text1: t('alerts.registrationErrorTitle'),
        text2: error.message, // error.message ya viene procesado de AuthContext
      });
    }
  };

  const BrandTextPlaceholder = () => (
    <Text style={styles.brandText}>{t('brandTextRegister')}</Text>
  );

  return (
    <AuthScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContentContainer}
      >
        <BrandTextPlaceholder />

        <View style={styles.formContainer}>
          {/* Campo Nombre */}
          <Controller
            control={control}
            name="name"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <StyledTextInput
                label={t('fullNameLabel')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('fullNamePlaceholder')}
                autoCapitalize="words"
                errorMessage={error ? t(error.message as string) : undefined}
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
            )}
          />
          {/* Campo Email */}
          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <StyledTextInput
                ref={emailInputRef}
                label={t('emailLabel')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={error ? t(error.message as string) : undefined}
                returnKeyType="next"
                // ✨ REFACTOR: El foco ahora salta directamente a la contraseña.
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            )}
          />

          {/* ✨ REFACTOR: Eliminado el campo de Teléfono por completo. */}

          {/* Campo Contraseña */}
          <Controller
            control={control}
            name="password"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              // ✨ REFACTOR: Usamos nuestro nuevo componente PasswordTextInput.
              <PasswordTextInput
                ref={passwordInputRef}
                label={t('passwordLabel')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('passwordPlaceholder')}
                errorMessage={error ? t(error.message as string) : undefined}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />
            )}
          />
          {/* ✨ REFACTOR: Usamos nuestro nuevo componente indicador. */}
          <PasswordStrengthIndicator password={passwordValue} />

          {/* Campo Confirmar Contraseña */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              // ✨ REFACTOR: Usamos PasswordTextInput de nuevo.
              <PasswordTextInput
                ref={confirmPasswordInputRef}
                label={t('confirmPasswordLabel')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('confirmPasswordPlaceholder')}
                errorMessage={error ? t(error.message as string) : undefined}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />

          {/* Checkbox de Términos */}
          <Controller
            control={control}
            name="agreeToTerms"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Checkbox
                  label={t('agreeToTerms')}
                  isChecked={value}
                  onPress={() => onChange(!value)}
                  containerStyle={styles.termsCheckboxContainer}
                  labelStyle={styles.termsCheckboxLabel}
                />
                {error && (
                  <Text style={styles.checkboxErrorText}>
                    {t(error.message as string)}
                  </Text>
                )}
              </>
            )}
          />

          <AuthButton
            title={t('registerButton')}
            onPress={handleSubmit(onSubmit)}
            isLoading={formIsSubmitting || auth.isLoading}
            style={{ marginTop: 20 }}
            disabled={!isValid || formIsSubmitting || auth.isLoading}
            icon={
              <UserPlusIcon
                size={20}
                color={COLORS.primaryBackground}
                weight="bold"
              />
            }
          />
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.haveAccountText}>
            {t('alreadyHaveAccountPrompt')}
          </Text>
          <AuthLink
            text={t('logInLinkText')}
            onPress={() => navigation.navigate('Login')}
            style={styles.signInLink}
          />
        </View>
      </ScrollView>
    </AuthScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandText: {
    fontSize: moderateScale(36),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    textAlign: 'center',
    marginVertical: verticalScale(25),
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: scale(5),
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(25),
    paddingBottom: verticalScale(20),
  },
  haveAccountText: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginRight: scale(5),
  },
  checkboxErrorText: {
    color: COLORS.error,
    fontSize: moderateScale(12),
    marginTop: verticalScale(-10),
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(5),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  signInLink: {
    fontSize: moderateScale(15),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  termsCheckboxContainer: {
    marginVertical: verticalScale(15),
  },
  termsCheckboxLabel: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    flexShrink: 1,
  },
});

export default RegisterScreen;
