import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// --- ✨ 1. Importaciones Clave para RHF, Zod y Componentes Reutilizables ✨ ---
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addressSchema,
  AddressFormData,
} from '../../components/schemas/addressSchema';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import StyledPicker from '../../components/common/inputs/StyledPicker';
import AuthButton from '../../components/auth/AuthButton';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import MaskedTextInput from '../../components/common/inputs/MaskedTextInput';

// --- ✨ 2. Importaciones de Lógica y Tipos ✨ ---
import { EditAddressScreenProps } from '../../types/navigation';
import { useUpdateAddress, useDeleteAddress } from '../../hooks/useAddresses';

import * as locationService from '../../services/location';
import { Country } from '../../types/locations';
import { COLORS } from '../../constants/colors';
import Toast from 'react-native-toast-message';

// --- Tipos locales para el componente ---
interface PickerItem {
  label: string;
  value: string;
}

export default function EditAddressScreen({
  navigation,
  route,
}: EditAddressScreenProps) {
  const { t } = useTranslation();
  const { address: addressToEdit } = route.params; // Obtenemos la dirección a editar

  // --- ✨ 3. Contexto y Estado de UI ✨ ---
  // Obtenemos las funciones del contexto. `loading` se renombra para evitar colisiones.

  const {
    mutate: updateAddress,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateAddress();
  const {
    mutate: deleteAddress,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteAddress();
  const [allLocations, setAllLocations] = useState<Country[]>([]);
  const [states, setStates] = useState<PickerItem[]>([]);
  const [cities, setCities] = useState<PickerItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const recipientNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const detailsRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);
  const instructionsRef = useRef<TextInput>(null);

  // --- ✨ 4. Inicialización de React Hook Form con Valores por Defecto ✨ ---
  // La clave de la pantalla de edición: los valores iniciales vienen de `addressToEdit`.
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      label: addressToEdit.label,
      recipientName: addressToEdit.recipientName,
      phone: addressToEdit.phone,
      street: addressToEdit.street,
      details: addressToEdit.details || '',
      postalCode: addressToEdit.postalCode,
      instructions: addressToEdit.instructions || '',
      country: addressToEdit.country,
      state: addressToEdit.state,
      city: addressToEdit.city,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // --- ✨ 5. Lógica de Negocio (Hooks y Handlers) ✨ ---
  const selectedCountry = watch('country');
  const selectedState = watch('state');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('address:add.title'), // Usamos la misma clave de traducción que ya tienes
    });
  }, [navigation, t]); // Se ejecuta cuando el componente se monta o cuando cambia el idioma

  // Carga de locaciones (exactamente igual que en AddAddressScreen)
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const data = await locationService.getHierarchicalLocations();
        setAllLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // Efectos en cascada para los pickers (exactamente igual que en AddAddressScreen)
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      setCities([]);
      setValue('state', null);
      setValue('city', null);
      return;
    }
    const countryData = allLocations.find((c) => c.country === selectedCountry);
    setStates(
      countryData
        ? countryData.states.map((s) => ({ label: s.state, value: s.state }))
        : [],
    );
    // Si el estado actual ya no pertenece al nuevo país, se reseteará en el siguiente efecto
  }, [selectedCountry, allLocations, setValue]);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setValue('city', null);
      return;
    }
    const countryData = allLocations.find((c) => c.country === selectedCountry);
    const stateData = countryData?.states.find(
      (s) => s.state === selectedState,
    );
    setCities(
      stateData
        ? stateData.cities.map((city) => ({ label: city, value: city }))
        : [],
    );
  }, [selectedState, selectedCountry, allLocations, setValue]);

  useEffect(() => {
    const error = updateError || deleteError;
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('common:error.title'),
        text2: error.message,
      });
    }
  }, [updateError, deleteError, t]);

  // Función para guardar los cambios
  const onSave = (data: AddressFormData) => {
    if (!data.country || !data.state || !data.city) {
      /* ... */ return;
    }

    const updatePayload = {
      label: data.label,
      recipientName: data.recipientName,
      phone: data.phone,
      street: data.street,
      details: data.details,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      instructions: data.instructions,
    };

    updateAddress(
      { addressId: addressToEdit.id, data: updatePayload },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: t('address:edit.successTitle'),
            text2: t('address:edit.successMessage'),
          });
          navigation.goBack();
        },
      },
    );
  };

  // Función para manejar la eliminación
  const handleDelete = () => {
    Alert.alert(
      t('address:delete.confirmTitle'),
      t('address:delete.confirmMessage', { label: addressToEdit.label }),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('address:delete.deleteButton'),
          style: 'destructive',
          onPress: () => {
            deleteAddress(addressToEdit.id, {
              onSuccess: () => {
                Toast.show({
                  type: 'info',
                  text1: t('address:delete.successTitle'),
                });
                navigation.goBack();
              },
            });
          },
        },
      ],
    );
  };
  // --- ✨ 6. Renderizado del Componente ✨ ---
  if (loadingLocations) {
    return <LoadingIndicator fullscreen />;
  }

  return (
    <FormProvider {...methods}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        {/* --- Formulario (reutiliza la misma estructura y componentes) --- */}
        <Controller
          control={control}
          name="label"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              label={t('address:form.label')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.label ? t(`errors:${errors.label.message}`) : undefined
              }
              returnKeyType="next"
              onSubmitEditing={() => recipientNameRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={control}
          name="recipientName"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={recipientNameRef}
              label={t('address:form.recipientName')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.recipientName
                  ? t(`errors:${errors.recipientName.message}`)
                  : undefined
              }
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <MaskedTextInput
              ref={phoneRef}
              label={t('address:form.phone')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.phone ? t(`errors:${errors.phone.message}`) : undefined
              }
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => streetRef.current?.focus()}
              mask={[
                '(',
                /\d/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
            />
          )}
        />
        <Controller
          control={control}
          name="street"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={streetRef}
              label={t('address:form.street')}
              placeholder={t('address:placeholders.street')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.street ? t(`errors:${errors.street.message}`) : undefined
              }
              onSubmitEditing={() => detailsRef.current?.focus()}
              returnKeyType="next"
            />
          )}
        />
        <Controller
          control={control}
          name="details"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={detailsRef}
              label={t('address:form.details')}
              placeholder={t('address:placeholders.details')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              returnKeyType="next"
              onSubmitEditing={() => postalCodeRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <StyledPicker
              label={t('address:form.country')}
              items={allLocations.map((c) => ({
                label: c.country,
                value: c.country,
              }))}
              onValueChange={onChange}
              value={value}
              placeholder={t('address:placeholders.selectCountry')}
              errorMessage={
                errors.country
                  ? t(`errors:${errors.country.message}`)
                  : undefined
              }
            />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => (
            <StyledPicker
              label={t('address:form.state')}
              items={states}
              onValueChange={onChange}
              value={value}
              placeholder={t('address:placeholders.selectState')}
              errorMessage={
                errors.state ? t(`errors:${errors.state.message}`) : undefined
              }
              disabled={!selectedCountry || states.length === 0}
            />
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <StyledPicker
              label={t('address:form.city')}
              items={cities}
              onValueChange={onChange}
              value={value}
              placeholder={t('address:placeholders.selectCity')}
              errorMessage={
                errors.city ? t(`errors:${errors.city.message}`) : undefined
              }
              disabled={!selectedState || cities.length === 0}
            />
          )}
        />
        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={postalCodeRef}
              label={t('address:form.postalCode')}
              placeholder={t('address:placeholders.postalCode')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.postalCode
                  ? t(`errors:${errors.postalCode.message}`)
                  : undefined
              }
              keyboardType="number-pad"
              returnKeyType="next"
              maxLength={5}
              onSubmitEditing={() => instructionsRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={control}
          name="instructions"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={instructionsRef}
              label={t('address:form.instructions')}
              placeholder={t('address:placeholders.instructions')}
              onBlur={onBlur}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSave)}
              onChangeText={onChange}
              value={value}
              multiline
            />
          )}
        />

        {/* --- Botones de Acción --- */}
        <View style={styles.actionsContainer}>
          <AuthButton
            title={t('address:edit.saveButton')}
            onPress={handleSubmit(onSave)}
            isLoading={isUpdating}
            disabled={isDeleting}
          />
          <AuthButton
            title={t('address:delete.deleteButton')}
            onPress={handleDelete}
            isLoading={isDeleting}
            disabled={isUpdating}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}

// --- ✨ 7. Estilos  ✨ ---
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  actionsContainer: {
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: COLORS.error, // Color rojo para indicar peligro
    marginTop: 15, // Espacio entre los botones
  },
  deleteButtonText: {
    color: COLORS.white, // Texto blanco para contraste
  },
});
