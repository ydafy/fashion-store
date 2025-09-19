import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { CameraIcon, PenIcon } from 'phosphor-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

// --- Lógica y Hooks ---
import { useAuth } from '../../contexts/AuthContext';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import {
  editProfileSchema,
  EditProfileFormData,
} from '../../components/schemas/editProfileSchema';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import StyledPicker from '../../components/common/inputs/StyledPicker';
import AuthButton from '../../components/auth/AuthButton';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';

const EditProfileScreen = () => {
  const { t } = useTranslation([
    'profile',
    'common',
    'errors',
    'auth',
    'header',
  ]);
  const { user } = useAuth();
  const { selectedImage, pickImage } = useImagePicker(); // Usaremos pickImage por ahora
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      birthDate: user?.birthDate || '',
      gender: user?.gender,
    },
  });

  // La URI de la imagen a mostrar: la nueva seleccionada, o la del usuario, o ninguna
  const imageUri = selectedImage || user?.avatarUrl;

  const onSubmit = (data: EditProfileFormData) => {
    // En un backend real, aquí subiríamos la 'selectedImage' a un servicio
    // como S3/Firebase Storage y obtendríamos una URL.
    // Por ahora, solo simulamos pasando la URI local o la URL existente.
    const payload = {
      ...data,
      avatarUrl: selectedImage || user?.avatarUrl,
    };
    updateProfile(payload);
  };

  const maxBirthDate = new Date();
  const minBirthDate = new Date();
  minBirthDate.setFullYear(maxBirthDate.getFullYear() - 100);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');

    setValue('birthDate', formattedDate, { shouldValidate: true });
    hideDatePicker();
  };

  const genderOptions = [
    { label: t('gender.male'), value: 'male' },
    { label: t('gender.female'), value: 'female' },
    { label: t('gender.other'), value: 'other' },
    { label: t('gender.prefer_not_to_say'), value: 'prefer_not_to_say' },
  ];

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('header:editProfileTitle')} showBackButton />
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarTouchable}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <CameraIcon
                  size={moderateScale(40)}
                  color={COLORS.secondaryText}
                />
              </View>
            )}
            <View style={styles.editIcon}>
              <PenIcon
                size={moderateScale(18)}
                color={COLORS.white}
                weight="fill"
              />
            </View>
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              label={t('auth:fullNameLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.name?.message ? t(errors.name.message) : undefined
              }
            />
          )}
        />

        <Controller
          control={control}
          name="birthDate"
          render={({ field: { value } }) => (
            <View style={styles.datePickerWrapper}>
              <Text style={styles.label}>{t('birthDateLabel')}</Text>
              <TouchableOpacity
                onPress={() => setDatePickerVisibility(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.datePickerText}>
                  {value
                    ? format(new Date(value), 'MMMM d, yyyy')
                    : t('selectDatePlaceholder')}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                  setValue('birthDate', format(date, 'yyyy-MM-dd'), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setDatePickerVisibility(false);
                }}
                onCancel={() => setDatePickerVisibility(false)}
                accentColor={COLORS.primaryText} // Para Android
                date={
                  value
                    ? new Date(value)
                    : new Date(
                        new Date().setFullYear(new Date().getFullYear() - 20),
                      )
                }
                maximumDate={maxBirthDate}
                minimumDate={minBirthDate}
              />
            </View>
          )}
        />

        {/* --- Selector de Género --- */}
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <StyledPicker
              label={t('genderLabel')}
              value={value}
              onValueChange={onChange}
              items={genderOptions}
              placeholder={t('gender.selectPlaceholder')}
            />
          )}
        />

        <AuthButton
          title={t('common:save')}
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          disabled={!isDirty || !isValid || isPending}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primaryBackground },
  content: { padding: moderateScale(20) },
  avatarContainer: { alignItems: 'center', marginBottom: verticalScale(30) },
  avatarTouchable: { position: 'relative' },
  avatar: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
  },
  avatarPlaceholder: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: COLORS.separator,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primaryText,
    padding: moderateScale(8),
    borderRadius: moderateScale(15),
    borderWidth: 2,
    borderColor: COLORS.primaryBackground,
  },
  label: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(8),
  },
  datePickerWrapper: {
    marginBottom: verticalScale(15),
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: moderateScale(8),
    padding: moderateScale(15),
    backgroundColor: COLORS.primaryBackground,
  },
  datePickerText: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
  },
  button: { marginTop: verticalScale(30) },
});

export default EditProfileScreen;
