import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import SavedPaymentMethods from './SavedPaymentMethods';
import { TruckIcon, StorefrontIcon, MapPinIcon } from 'phosphor-react-native';

// ✨ RHF: Importaciones clave para la refactorización
import { useFormContext, Controller } from 'react-hook-form';

// Componentes y Tipos
import { Address } from '../../types/address';
import { PickupLocation } from '../../types/pickup_location';
import { COLORS } from '../../constants/colors';
import { PaymentMethod } from '../../types/payment';
import {
  DEFAULT_SHIPPING_COST,
  DEFAULT_TAX_RATE,
} from '../../constants/appConfig'; // ✨ Usar constantes globales
import { formatCurrency } from '../../utils/formatters'; // ✨ Usar formatter

import DeliveryMethodButton from './DeliveryMethodButton';
import StyledTextInput from '../common/inputs/StyledTextInput';
import PaymentForm from './PaymentForm'; // Este también lo refactorizaremos

import LoadingIndicator from '../common/LoadingIndicator';
import EmptyState from '../common/EmptyState';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import MaskedTextInput from '../common/inputs/MaskedTextInput';
import { useAddressModal } from '../../contexts/AddressModalContext';

// ✨ RHF: Las props se reducen drásticamente.
// Solo pasamos datos que NO pertenecen al formulario (como `selectedAddress` del context)
// y los handlers para acciones que NO son del formulario.
export interface ScreenContentProps {
  selectedMethod: 'delivery' | 'pickup';
  selectedAddress: Address | null;
  selectedPickupLocation: PickupLocation | null;
  pickupLocations: PickupLocation[];
  loadingPickup: boolean;
  errorPickup: string | null;
  cartTotal: number;
  isConfirmingOrder: boolean;
  paymentMethods?: PaymentMethod[]; // Lista de tarjetas guardadas
  isLoadingPaymentMethods: boolean; // Estado de carga de las tarjetas
  mutatingCardId: string | null;
  handleSelectCard: (method: PaymentMethod) => void;
  handleDeleteCard: (method: PaymentMethod) => void;
  handleSelectMethod: (method: 'delivery' | 'pickup') => void;
  handleSelectPickupLocation: (location: PickupLocation | null) => void;
  handleConfirmOrder: () => void;
}

const ScreenContent: React.FC<ScreenContentProps> = ({
  selectedMethod,
  selectedAddress,
  selectedPickupLocation,
  pickupLocations,
  loadingPickup,
  errorPickup,
  cartTotal,
  isConfirmingOrder,
  handleSelectMethod,
  handleSelectPickupLocation,
  handleConfirmOrder,
  paymentMethods,
  isLoadingPaymentMethods,
  mutatingCardId,
  handleSelectCard,
  handleDeleteCard,
}) => {
  const { t } = useTranslation();

  // ✨ RHF: Obtenemos todo lo necesario del contexto del formulario. ¡Adiós prop drilling!
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const selectedPickupLocationId = watch('pickupLocationId');

  const pickupEmailRef = useRef<TextInput>(null);
  const pickupPhoneRef = useRef<TextInput>(null);
  //FUNCIÓN PARA ABRIR EL MODAL
  const { openAddressModal } = useAddressModal();

  const selectedCardId = watch('selectedCardId');

  const [paymentView, setPaymentView] = useState<'saved' | 'new'>('saved');
  // ✨ ESTADO PARA CONTROLAR LA UI DE PAGO
  const currentShippingCost =
    selectedMethod === 'delivery' ? DEFAULT_SHIPPING_COST : 0;
  const taxAmount = cartTotal * DEFAULT_TAX_RATE;
  const finalTotal = cartTotal + currentShippingCost + taxAmount;

  // Efecto para establecer la vista inicial y los valores del formulario
  useEffect(() => {
    const hasSavedMethods = paymentMethods && paymentMethods.length > 0;
    const initialView = hasSavedMethods ? 'saved' : 'new';
    setPaymentView(initialView);
    setValue('paymentSelection', initialView);

    if (hasSavedMethods) {
      const defaultCard =
        paymentMethods.find((m) => m.isDefault) || paymentMethods[0];
      setValue('selectedCardId', defaultCard.id);
    }
  }, [paymentMethods, setValue]);

  const handleTogglePaymentView = () => {
    const newView = paymentView === 'saved' ? 'new' : 'saved';
    setPaymentView(newView);
    setValue('paymentSelection', newView, { shouldValidate: true });
  };

  const renderPaymentSection = () => {
    if (isLoadingPaymentMethods) {
      return <LoadingIndicator style={styles.centeredLoader} />;
    }

    const hasSavedMethods = paymentMethods && paymentMethods.length > 0;

    if (!hasSavedMethods) {
      return <PaymentForm />;
    }

    return (
      <>
        {/* Si estamos en la vista 'saved', mostramos la lista */}
        {paymentView === 'saved' && (
          <SavedPaymentMethods
            paymentMethods={paymentMethods}
            isLoading={isLoadingPaymentMethods}
            selectedCardId={selectedCardId}
            mutatingCardId={mutatingCardId}
            onSelect={handleSelectCard}
            onDelete={handleDeleteCard}
          />
        )}

        {/* Si estamos en la vista 'new', mostramos el formulario */}
        {paymentView === 'new' && <PaymentForm />}

        {/* Siempre mostramos el botón para alternar */}
        <TouchableOpacity onPress={handleTogglePaymentView}>
          <Text style={styles.togglePaymentFormText}>
            {paymentView === 'saved'
              ? t('checkout:payment.addNewCard')
              : t('checkout:payment.useSavedCard')}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.contentWrapper}>
      {/* --- Sección Método de Envío --- */}
      <View style={styles.deliveryMethodSection}>
        <DeliveryMethodButton
          icon={
            <TruckIcon
              size={moderateScale(24)}
              color={
                selectedMethod === 'delivery'
                  ? COLORS.accent
                  : COLORS.primaryText
              }
              weight="regular"
            />
          }
          text={t('checkout:content.deliveryMethod')}
          isSelected={selectedMethod === 'delivery'}
          onPress={() => handleSelectMethod('delivery')}
        />
        <DeliveryMethodButton
          icon={
            <StorefrontIcon
              size={moderateScale(24)}
              color={
                selectedMethod === 'pickup' ? COLORS.accent : COLORS.primaryText
              }
              weight="regular"
            />
          }
          text={t('checkout:content.pickupMethod')}
          isSelected={selectedMethod === 'pickup'}
          onPress={() => handleSelectMethod('pickup')}
        />
      </View>

      {/* --- Sección Detalles de Envío/Recogida --- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.shippingDataTitle}>
            {selectedMethod === 'delivery'
              ? t('checkout:content.shippingDetailsTitle')
              : t('checkout:content.pickupDetailsTitle')}
          </Text>
          {/* Mostramos el botón "Cambiar" solo si el método es entrega */}
          {selectedMethod === 'delivery' && (
            <TouchableOpacity
              onPress={openAddressModal}
              accessibilityRole="button"
            >
              <Text style={styles.changeButtonText}>{t('common:change')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedMethod === 'delivery' &&
          (selectedAddress ? (
            <View style={styles.addressDetailsContainer}>
              <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
              <Text style={styles.addressLine}>{selectedAddress.street}</Text>
              <Text style={styles.addressLine}>
                {`${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postalCode}`}
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={openAddressModal}>
              <Text style={styles.errorText}>
                {t('errors:addressRequired')}
              </Text>
            </TouchableOpacity>
          ))}

        {selectedMethod === 'pickup' && (
          <View style={styles.pickupSection}>
            {loadingPickup && <LoadingIndicator color={COLORS.primaryText} />}
            {!loadingPickup && errorPickup && (
              <Text style={styles.errorText}>{errorPickup}</Text>
            )}
            {!loadingPickup && !errorPickup && pickupLocations.length === 0 && (
              <EmptyState
                icon={
                  <MapPinIcon
                    size={moderateScale(48)}
                    color={COLORS.secondaryText}
                  />
                }
                message={t('checkout:content.noPickupLocations')}
                subtext={t('checkout:content.noPickupLocationsSubtext')}
              />
            )}

            {/* ✨ RHF: Input oculto para el ID de la ubicación de recogida */}

            {/* --- ✨ 2. RENDERIZAMOS LA LISTA DIRECTAMENTE, SIN CONTROLLER ✨ --- */}

            {!loadingPickup &&
              pickupLocations.map((location) => (
                <TouchableOpacity
                  key={location.id}
                  style={[
                    styles.pickupLocationItem,
                    selectedPickupLocationId === location.id &&
                      styles.selectedPickupLocationItem,
                  ]}
                  onPress={() => handleSelectPickupLocation(location)}
                >
                  <Text style={styles.pickupLocationName}>{location.name}</Text>
                  <Text style={styles.pickupLocationAddress}>
                    {location.address}
                  </Text>
                  <Text style={styles.pickupLocationHours}>
                    {location.hours}
                  </Text>
                </TouchableOpacity>
              ))}

            {errors.pickupLocationId && (
              <Text style={styles.errorText}>
                {t(`errors:${errors.pickupLocationId.message as string}`)}
              </Text>
            )}

            {/* --- Formulario de Contacto para Recogida (si hay ubicaciones) --- */}
            {pickupLocations.length > 0 && (
              <View style={styles.pickupContactContainer}>
                <Text style={styles.contactTitle}>
                  {t('checkout:content.pickupContactTitle')}
                </Text>

                {/* ✨ RHF: Usamos Controller para cada input */}
                <Controller
                  control={control}
                  name="pickupName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <StyledTextInput
                      placeholder={t('checkout:placeholders.pickupName')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      errorMessage={
                        errors.pickupName
                          ? t(`errors:${errors.pickupName.message}`)
                          : undefined
                      }
                      returnKeyType="next"
                      onSubmitEditing={() => pickupEmailRef.current?.focus()}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="pickupEmail"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <StyledTextInput
                      placeholder={t('checkout:placeholders.pickupEmail')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      errorMessage={
                        errors.pickupEmail
                          ? t(`errors:${errors.pickupEmail.message}`)
                          : undefined
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => pickupPhoneRef.current?.focus()}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="pickupPhone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <MaskedTextInput
                      placeholder={t('checkout:placeholders.pickupPhone')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      errorMessage={
                        errors.pickupPhone
                          ? t(`errors:${errors.pickupPhone.message}`)
                          : undefined
                      }
                      keyboardType="phone-pad"
                      returnKeyType="done"
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
              </View>
            )}
          </View>
        )}
      </View>

      {/* --- Sección de Pago --- */}
      <View style={styles.section}>
        <Text style={styles.paymentTitle}>
          {t('checkout:content.paymentTitle')}
        </Text>
        {renderPaymentSection()}
      </View>

      {/* --- Sección Resumen de Costos --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('checkout:content.costSummaryTitle')}
        </Text>
        <View style={styles.costSummaryRow}>
          <Text style={styles.costSummaryLabel}>
            {t('checkout:content.subtotal')}
          </Text>
          <Text style={styles.costSummaryAmount}>
            {formatCurrency(cartTotal)}
          </Text>
        </View>
        <View style={styles.costSummaryRow}>
          <Text style={styles.costSummaryLabel}>
            {t('checkout:content.shipping')}
          </Text>
          <Text style={styles.costSummaryAmount}>
            {currentShippingCost === 0
              ? t('common:free')
              : formatCurrency(currentShippingCost)}
          </Text>
        </View>
        <View style={styles.costSummaryRow}>
          <Text style={styles.costSummaryLabel}>
            {t('checkout:content.taxes', { rate: DEFAULT_TAX_RATE * 100 })}
          </Text>
          <Text style={styles.costSummaryAmount}>
            {formatCurrency(taxAmount)}
          </Text>
        </View>
      </View>

      {/* --- Sección Total FINAL --- */}
      <View style={styles.finalTotalSection}>
        <Text style={styles.finalTotalLabel}>
          {t('checkout:content.total')}
        </Text>
        <Text style={styles.finalTotalAmount}>
          {formatCurrency(finalTotal)}
        </Text>
      </View>

      {/* --- Botón Confirmar --- */}
      <View style={styles.confirmButtonOuterContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            isConfirmingOrder && styles.disabledButton,
          ]}
          onPress={handleConfirmOrder}
          activeOpacity={0.8}
          disabled={isConfirmingOrder}
          accessibilityRole="button"
          accessibilityLabel={t('checkout:content.confirmOrderButton')}
          accessibilityState={{ disabled: isConfirmingOrder }}
        >
          {isConfirmingOrder ? (
            <LoadingIndicator size="small" color={COLORS.primaryBackground} />
          ) : (
            <Text style={styles.confirmButtonText}>
              {t('checkout:content.confirmOrderButton')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentWrapper: {},

  deliveryMethodSection: { marginBottom: verticalScale(25) },
  section: {
    marginBottom: verticalScale(20),
    paddingBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },

  shippingDataTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },

  changeButtonText: {
    fontSize: moderateScale(14),
    color: COLORS.accent,
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  addressDetailsContainer: { marginBottom: verticalScale(15) },
  addressLabel: {
    fontSize: moderateScale(15),
    fontWeight: '400',
    color: COLORS.primaryText,
    marginBottom: verticalScale(5),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  addressLine: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(3),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: verticalScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(14),
  },
  pickupSection: {
    marginBottom: verticalScale(20),
    paddingBottom: verticalScale(15),
  },
  pickupLocationItem: {
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: verticalScale(10),
  },
  selectedPickupLocationItem: {
    borderColor: COLORS.accent,
    backgroundColor: '#f0f5ff',
  },
  pickupLocationName: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: verticalScale(4),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  togglePaymentFormText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginVertical: verticalScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  paymentTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: verticalScale(8),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  centeredLoader: {
    marginVertical: verticalScale(20),
  },
  pickupLocationAddress: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    marginBottom: verticalScale(4),
    fontFamily: 'FacultyGlyphic-Regular',
  },
  pickupLocationHours: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    fontStyle: 'italic',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  pickupContactContainer: {
    marginTop: verticalScale(25),
    paddingTop: verticalScale(15),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  contactTitle: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: verticalScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
  },

  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(10),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  costSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  costSummaryLabel: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  costSummaryAmount: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  finalTotalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    marginTop: verticalScale(5),
    borderTopWidth: 1.5,
    borderTopColor: COLORS.primaryText,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.primaryText,
    marginBottom: verticalScale(20),
  },
  finalTotalLabel: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  finalTotalAmount: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  confirmButtonOuterContainer: {
    marginTop: verticalScale(15),
    marginBottom: verticalScale(60),
    paddingHorizontal: scale(5),
  },
  confirmButton: {
    backgroundColor: COLORS.primaryText,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(50),
  },
  confirmButtonText: {
    color: COLORS.primaryBackground,
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'FacultyGlyphic-Regular',
  },
  disabledButton: {
    backgroundColor: COLORS.secondaryText,
  },
});

export default ScreenContent;
