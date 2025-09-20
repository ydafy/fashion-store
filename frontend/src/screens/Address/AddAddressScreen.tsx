import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Platform, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// ✨ 1. Importaciones clave para RHF y Zod
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addressSchema,
  AddressFormData,
} from '../../components/schemas/addressSchema';

// ✨ 2. Componentes y Servicios
import { AddAddressScreenProps } from '../../types/navigation';
import * as locationService from '../../services/location'; // Usamos el servicio
import { Country } from '../../types/locations';
import StyledTextInput from '../../components/common/inputs/StyledTextInput';
import MaskedTextInput from '../../components/common/inputs/MaskedTextInput';
import StyledPicker from '../../components/common/inputs/StyledPicker';
import AuthButton from '../../components/auth/AuthButton';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import Toast from 'react-native-toast-message';

import { useAddAddress } from '../../hooks/useAddresses';
import { COLORS } from '../../constants/colors';

// ✨ 3. Tipos para los items del Picker
interface PickerItem {
  label: string;
  value: string;
}

export default function AddAddressScreen({
  navigation,
}: AddAddressScreenProps) {
  const { t } = useTranslation();
  const { mutate: addAddress, isPending, error } = useAddAddress();

  // ✨  Estado local solo para la UI, no para los datos del formulario
  const [allLocations, setAllLocations] = useState<Country[]>([]);
  const [states, setStates] = useState<PickerItem[]>([]);
  const [cities, setCities] = useState<PickerItem[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // ✨ LAS REFS PARA LA CADENA DE FOCO
  const recipientNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const streetRef = useRef<TextInput>(null);
  const detailsRef = useRef<TextInput>(null);
  const postalCodeRef = useRef<TextInput>(null);
  const instructionsRef = useRef<TextInput>(null);

  // ✨ 5. Inicialización de React Hook Form
  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: {
      label: '',
      recipientName: '',
      phone: '',
      street: '',
      details: '',
      postalCode: '',
      instructions: '',
      // Los campos de picker (country, state, city) no necesitan valor por defecto aquí
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  // ✨ 6. Observadores para los campos de selección
  const selectedCountry = watch('country');
  const selectedState = watch('state');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('address:add.title'), // Usamos la misma clave de traducción que ya tienes
    });
  }, [navigation, t]); // Se ejecuta cuando el componente se monta o cuando cambia el idioma

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('common:error.title'),
        text2: error.message,
      });
    }
  }, [error, t]);

  // ✨ 7. Lógica de API movida a un useEffect y usando el servicio
  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const data = await locationService.getHierarchicalLocations();
        setAllLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Aquí podrías mostrar un Toast de error
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  // ✨ 8. useEffects para actualizar las listas de estados y ciudades
  useEffect(() => {
    // Cuando el país cambia, resetea estado y ciudad.
    // Usamos 'null' porque es lo que RNPickerSelect interpreta como "nada seleccionado".
    // NO validamos en este punto.
    setValue('state', null);
    setValue('city', null);

    if (selectedCountry) {
      const countryData = allLocations.find(
        (c) => c.country === selectedCountry,
      );
      setStates(
        countryData
          ? countryData.states.map((s) => ({ label: s.state, value: s.state }))
          : [],
      );
    } else {
      setStates([]);
    }
  }, [selectedCountry, allLocations, setValue]);

  useEffect(() => {
    // Cuando el estado cambia, resetea la ciudad.
    setValue('city', null);

    if (selectedCountry && selectedState) {
      const countryData = allLocations.find(
        (c) => c.country === selectedCountry,
      );
      const stateData = countryData?.states.find(
        (s) => s.state === selectedState,
      );
      setCities(
        stateData
          ? stateData.cities.map((city) => ({ label: city, value: city }))
          : [],
      );
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry, allLocations, setValue]);

  // ✨ 3. ACTUALIZAMOS LA FUNCIÓN de envío
  const onSave = (data: AddressFormData) => {
    if (!data.country || !data.state || !data.city) {
      return;
    }

    const addressPayload = {
      ...data,
      country: data.country,
      state: data.state,
      city: data.city,
    };

    // Llamamos a la mutación de TanStack Query
    addAddress(addressPayload, {
      onSuccess: () => {
        // La invalidación de la query en el hook se encarga de refrescar la lista.
        // Simplemente mostramos un Toast y volvemos atrás.
        Toast.show({
          type: 'success',
          text1: t('address:edit.successTitle'),
          text2: t('address:edit.successMessage'),
        });
        navigation.goBack();
      },
      // onError ya se maneja con el 'useEffect' de arriba, no necesitamos hacer nada aquí.
    });
  };

  if (loadingLocations) {
    return <LoadingIndicator fullscreen />;
  }

  return (
    // ✨ El FormProvider permite que los componentes anidados usen useFormContext si es necesario
    <FormProvider {...methods}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      >
        {/* ✨ 10. Usamos Controller para cada input, con nuestro StyledTextInput */}
        <Controller
          control={control}
          name="label"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              label={t('address:form.label')}
              placeholder={t('address:placeholders.label')}
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

        {/* Repetimos el patrón para todos los campos de texto... */}
        <Controller
          control={control}
          name="recipientName"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledTextInput
              ref={recipientNameRef}
              label={t('address:form.recipientName')}
              placeholder={t('address:placeholders.recipientName')}
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
              placeholder={t('address:placeholders.phone')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={
                errors.phone ? t(`errors:${errors.phone.message}`) : undefined
              }
              keyboardType="phone-pad"
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
              returnKeyType="next"
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

        {/* ✨ 11. Usamos Controller para los Pickers con un nuevo componente StyledPicker */}
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

        {/* ✨ 12. Usamos nuestro AuthButton reutilizable */}
        <AuthButton
          title={t('address:add.saveButton')}
          onPress={handleSubmit(onSave)}
          isLoading={isPending}
        />
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}

// --- Estilos (Iguales que antes, asegúrate que los tienes todos) ---
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
});
