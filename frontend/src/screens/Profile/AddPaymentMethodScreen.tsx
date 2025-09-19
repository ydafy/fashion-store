import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MaskInput from 'react-native-mask-input';

// --- Lógica y Tipos ---
import {
  paymentSchema,
  PaymentFormData,
} from '../../components/schemas/paymentSchema';
import { useAddPaymentMethod } from '../../hooks/usePaymentMethods';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import CardNumberInput from '../../components/forms/CardNumberInput';
import AuthButton from '../../components/auth/AuthButton';
import Checkbox from '../../components/common/Checkbox';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import { createPaymentToken } from '../../services/paymentGateway';

import InfoModal from '../../components/modal/InfoModal';
import CvvHelpImage from '../../../assets/images/logos/cvvLogo.svg';

import { QuestionIcon } from 'phosphor-react-native';

const AddPaymentMethodScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { mutate: addPaymentMethod, isPending } = useAddPaymentMethod();

  // ✨ ESTADO PARA CONTROLAR LA VISIBILIDAD DEL MODAL DE AYUDA
  const [isCvvHelpVisible, setIsCvvHelpVisible] = useState(false);

  // ✨  UN ESTADO LOCAL PARA CONTROLAR EL ESTADO DE CARGA COMPLETO
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✨  LAS REFERENCIAS PARA CADA CAMPO DE TEXTO
  const cardNumberRef = useRef<TextInput>(null);
  const expiryDateRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const cardHolderNameRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);

  // ✨ Configuración de React Hook Form con validación instantánea
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onBlur',
    defaultValues: {
      isDefault: true,
      cardHolderName: '',
      cardNumber: '',
      cvv: '',
      expiryDate: '',
      nickname: '',
    },
  });

  const showCvvHelp = () => {
    Keyboard.dismiss(); // Primero, cerramos el teclado
    setIsCvvHelpVisible(true); // Luego, mostramos el modal
  };

  const hideCvvHelp = () => {
    setIsCvvHelpVisible(false); // Cerramos el modal
    // Usamos un pequeño delay para que el teclado no reaparezca bruscamente
    setTimeout(() => {
      cvvRef.current?.focus(); // Volvemos a enfocar el campo del CVV
    }, 250);
  };

  // ✨ 2. HOOK useEffect PARA ENFOCAR AUTOMÁTICAMENTE AL MONTAR
  useEffect(() => {
    // Usamos un setTimeout para asegurar que la transición de la pantalla haya terminado
    // y el campo de texto esté listo para recibir el foco.
    const timer = setTimeout(() => {
      cardNumberRef.current?.focus();
    }, 250); // Un pequeño retardo es más robusto

    // Función de limpieza para evitar problemas si el componente se desmonta rápido
    return () => clearTimeout(timer);
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  /**
   * Se ejecuta cuando el formulario es válido y se envía.
   */
  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true); // Iniciamos el estado de carga

    try {
      // 1. Enviamos los datos crudos al "gateway de pago" para obtener un token
      const tokenizedData = await createPaymentToken(data);

      // 2. Usamos el token para llamar a la mutación que habla con NUESTRO backend
      addPaymentMethod(tokenizedData, {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: t('payments:add.successTitle'),
            text2: t('payments:add.successMessage'),
          });
          navigation.goBack();
        },
        onError: (error) => {
          Toast.show({
            type: 'error',
            text1: t('common:error.title'),
            text2: error.message || t('payments:add.errorMessage'),
          });
        },
      });
    } catch (error) {
      // Manejar un error en el paso de tokenización
      Toast.show({
        type: 'error',
        text1: t('common:error.title'),
        text2: t('payments:add.tokenizationError'), // Nueva traducción
      });
    } finally {
      setIsSubmitting(false); // Detenemos el estado de carga
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('header:addCard')} showBackButton={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flexContainer}
        keyboardVerticalOffset={verticalScale(60)}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ✨ Cada campo está envuelto en un Controller para un rendimiento óptimo */}
          <Controller
            control={control}
            name="cardNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <CardNumberInput
                ref={cardNumberRef}
                label={t('payments:form.cardNumber')}
                onBlur={() => {
                  onBlur(); // Primero llamamos al onBlur original
                  trigger('cardNumber'); // Luego forzamos la validación
                }}
                onChangeText={onChange}
                value={value}
                errorMessage={
                  errors.cardNumber?.message
                    ? t(`errors:${errors.cardNumber.message}`)
                    : undefined
                }
                placeholder="0000 0000 0000 0000"
                returnKeyType="next"
                onSubmitEditing={() => expiryDateRef.current?.focus()}
              />
            )}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="expiryDate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.label}>
                      {t('payments:form.expiryDate')}
                    </Text>
                    <MaskInput
                      ref={expiryDateRef}
                      value={value}
                      onChangeText={(masked, unmasked) => {
                        onChange(masked); // Pasamos el texto formateado a RHF
                      }}
                      onBlur={() => {
                        onBlur();
                        trigger('expiryDate');
                      }}
                      mask={[/\d/, /\d/, '/', /\d/, /\d/]}
                      placeholder={t('payments:form.expiryPlaceholder')}
                      keyboardType="number-pad"
                      style={[
                        styles.inputBase,
                        errors.expiryDate ? styles.errorBorder : {},
                      ]}
                      placeholderTextColor={COLORS.secondaryText}
                      returnKeyType="next"
                      onSubmitEditing={() => cvvRef.current?.focus()}
                    />
                    <View style={styles.errorContainer}>
                      {errors.expiryDate && (
                        <Text style={styles.errorText}>
                          {t(`errors:${errors.expiryDate.message}`)}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              />
            </View>
            <View style={styles.halfWidth}>
              <Controller
                control={control}
                name="cvv"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledTextInput
                    ref={cvvRef}
                    label={t('payments:form.cvv')}
                    placeholder="123"
                    onBlur={() => {
                      onBlur();
                      trigger('cvv');
                    }}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={
                      errors.cvv?.message
                        ? t(`errors:${errors.cvv.message}`)
                        : undefined
                    }
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => cardHolderNameRef.current?.focus()}
                    rightIcon={
                      <TouchableOpacity
                        onPress={showCvvHelp}
                        accessibilityRole="button"
                        accessibilityLabel={t(
                          'payments:cvvHelp.accessibilityLabel',
                        )}
                      >
                        <QuestionIcon
                          size={moderateScale(22)}
                          color={COLORS.secondaryText}
                        />
                      </TouchableOpacity>
                    }
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="cardHolderName"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledTextInput
                ref={cardHolderNameRef}
                label={t('payments:form.cardHolderName')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={
                  errors.cardHolderName?.message
                    ? t(`errors:${errors.cardHolderName.message}`)
                    : undefined
                }
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => nicknameRef.current?.focus()}
              />
            )}
          />

          <Controller
            control={control}
            name="nickname"
            render={({ field: { onChange, onBlur, value } }) => (
              <StyledTextInput
                ref={nicknameRef}
                label={`${t('payments:form.nickname')} (${t('common:optional')})`}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={
                  errors.nickname?.message
                    ? t(`errors:${errors.nickname.message}`)
                    : undefined
                }
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                label={t('payments:form.setDefault')}
                isChecked={value || false}
                onPress={() => onChange(!value)} // Asumiendo que tu Checkbox usa onPress
              />
            )}
          />
          <AuthButton
            title={t('common:save')}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
      <InfoModal
        isVisible={isCvvHelpVisible}
        onClose={hideCvvHelp}
        title={t('payments:cvvHelp.title')}
        message={t('payments:cvvHelp.message')}
        image={<CvvHelpImage width={moderateScale(200)} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  flexContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  footer: {
    paddingVertical: verticalScale(1),
    paddingHorizontal: moderateScale(20),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    backgroundColor: COLORS.primaryBackground,
  },
  saveButton: {
    marginTop: verticalScale(10),
  },
  inputWrapper: {
    width: '100%',
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(8),
  },
  inputBase: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(8),
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorContainer: {
    minHeight: verticalScale(18),
    marginTop: verticalScale(3),
    paddingHorizontal: scale(2),
  },
  errorText: {
    color: COLORS.error,
    fontSize: moderateScale(12),
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default AddPaymentMethodScreen;
