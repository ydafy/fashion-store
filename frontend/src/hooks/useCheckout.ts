import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';

// --- Tipos y Schemas ---
import {
  checkoutSchema,
  CheckoutFormData,
} from '../components/schemas/checkoutSchema';
import { CheckoutScreenNavigationProp } from '../types/navigation';
import { Order } from '../types/order';
import { PickupLocation } from '../types/pickup_location';
import { PaymentFormData } from '../components/schemas/paymentSchema';
import { PaymentMethod } from '../types/payment';

// --- Contextos y Hooks de Lógica ---
import { useCart } from '../contexts/CartContext';
import { useAddress } from '../contexts/AddressContext';
import { useAuth } from '../contexts/AuthContext';
import {
  usePaymentMethods,
  useAddPaymentMethod,
  useDeletePaymentMethod,
} from './usePaymentMethods';

// --- Servicios ---
import { createPaymentToken } from '../services/paymentGateway';
import * as locationService from '../services/location';
import * as orderService from '../services/order';
import { processPayment } from '../services/paymentGateway';

// --- Constantes ---
import {
  DEFAULT_SHIPPING_COST,
  DEFAULT_TAX_RATE,
} from '../constants/appConfig';

/**
 * @description Un custom hook que encapsula toda la lógica de negocio y estado para la pantalla de Checkout.
 */
export const useCheckout = () => {
  // --- SECCIÓN 1: Hooks Fundamentales ---
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { t } = useTranslation();

  // --- SECCIÓN 2: Hooks de Contexto y Datos del Servidor ---
  const { cartItems, cartTotal, clearCart } = useCart();
  const { selectedAddress } = useAddress();
  const { user, token } = useAuth();

  // Hooks de datos para los métodos de pago
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    usePaymentMethods();
  const { mutateAsync: addPaymentMethod } = useAddPaymentMethod(); // Usamos mutateAsync para poder usar await
  const { mutate: deleteMethod } = useDeletePaymentMethod();

  // --- SECCIÓN 3: Estado Local de la UI ---
  const [mutatingCardId, setMutatingCardId] = useState<string | null>(null);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [loadingPickup, setLoadingPickup] = useState<boolean>(false);
  const [errorPickup, setErrorPickup] = useState<string | null>(null);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  // Inicialización de React Hook Form
  const methods: UseFormReturn<CheckoutFormData> = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      shippingMethod: 'delivery',
      paymentMethod: 'card',
      pickupName: user?.name || '',
      pickupEmail: user?.email || '',
      pickupPhone: '',
      cardHolderName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      saveCard: false,
    },
  });

  const { handleSubmit, watch, setValue } = methods;

  // --- SECCIÓN 5: Lógica de Negocio y Efectos ---
  // Carga de puntos de recogida
  useEffect(() => {
    const fetchPickupLocations = async () => {
      if (!selectedAddress) {
        setPickupLocations([]);
        setLoadingPickup(false);
        return;
      }

      setLoadingPickup(true);
      setErrorPickup(null);
      try {
        // Llama a la función de servicio CORRECTA con los parámetros CORRECTOS
        const data = await locationService.getPickupLocations(
          selectedAddress.city,
          selectedAddress.country,
        );
        setPickupLocations(data);
      } catch (err: any) {
        setErrorPickup(err.message || t('checkout:errors.genericPickupError'));
      } finally {
        setLoadingPickup(false);
      }
    };

    fetchPickupLocations();
  }, [selectedAddress, t]);

  // Observador del método de envío para los cálculos
  const selectedMethod = watch('shippingMethod');
  const selectedPickupLocationId = watch('pickupLocationId');

  const selectedPickupLocation = useMemo(
    () =>
      pickupLocations.find((loc) => loc.id === selectedPickupLocationId) ||
      null,
    [pickupLocations, selectedPickupLocationId],
  );

  // ✨ CÁLCULOS DE COSTOS CENTRALIZADOS Y MEMOIZADOS ✨
  const shippingCost = useMemo(() => {
    return selectedMethod === 'delivery' ? DEFAULT_SHIPPING_COST : 0;
  }, [selectedMethod]);

  const taxAmount = useMemo(() => {
    return (cartTotal + shippingCost) * DEFAULT_TAX_RATE;
  }, [cartTotal, shippingCost]);

  const finalTotal = useMemo(() => {
    return cartTotal + shippingCost + taxAmount;
  }, [cartTotal, shippingCost, taxAmount]);

  // Función de envío del pedido
  const onConfirmOrder = async (data: CheckoutFormData) => {
    if (!user || !user.id || !user.isEmailVerified) {
      Alert.alert(
        t('checkout:authRequiredTitle'),
        t('checkout:authRequiredMessage'),
        [
          {
            text: t('common:ok'),
            onPress: () =>
              navigation.navigate('AuthStack', { screen: 'Login' }),
          },
        ],
      );
      return;
    }

    if (!user.isEmailVerified) {
      Alert.alert(
        t('checkout.emailVerificationRequiredTitle'),
        t('checkout.emailVerificationRequiredMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('profile.resendVerificationLink'),
            onPress: () => {
              Toast.show({
                type: 'info',
                text1: t('profile.alerts.verificationEmailSentTitle'),
                text2: t('profile.alerts.verificationEmailSentMessage', {
                  email: user.email,
                }),
              });
            },
          },
        ],
      );
      return;
    }

    if (data.shippingMethod === 'delivery' && !selectedAddress) {
      Alert.alert(
        t('checkout.addressRequiredTitle'),
        t('checkout.addressRequiredMessage'),
      );
      return;
    }

    setIsConfirmingOrder(true);

    try {
      // --- ✨ LÓGICA DE GUARDADO DE TARJETA MEJORADA Y RESILIENTE ✨ ---
      // Solo se ejecuta si el usuario está añadiendo una nueva tarjeta Y marca la casilla
      if (data.paymentSelection === 'new' && data.saveCard) {
        // Envolvemos esta lógica en su propio try/catch para que no detenga el checkout si falla.
        try {
          const cardFormData: PaymentFormData = {
            cardNumber: data.cardNumber || '',
            cardHolderName: data.cardHolderName || '',
            expiryDate: data.cardExpiry || '',
            cvv: data.cardCvv || '',
            isDefault: true, // Al guardar desde checkout, la hacemos la predeterminada
          };

          const tokenizedData = await createPaymentToken(cardFormData);
          await addPaymentMethod(tokenizedData);

          Toast.show({
            type: 'success',
            text1: t('payments:add.successTitle'),
            text2: t('payments:add.successMessageCheckout'), // Nuevo texto más contextual
          });
        } catch (saveCardError) {
          console.error('Failed to save card during checkout:', saveCardError);
          // Mostramos un Toast de tipo 'info' (no bloqueante) y continuamos
          Toast.show({
            type: 'info',
            text1: t('payments:add.saveErrorTitle'),
            text2: t('payments:add.saveErrorMessage'),
          });
        }
      }

      const paymentResult = await processPayment({
        amount: finalTotal, // Usamos el total calculado
        // Decidimos qué credencial de pago usar
        savedCardId:
          data.paymentSelection === 'saved' ? data.selectedCardId : undefined,
        // En un caso real, aquí usaríamos el 'token' de la tarjeta nueva.
        // Por simplicidad, la simulación funciona sin él, pero la estructura está lista.
      });

      // Si el pago es rechazado, mostramos un error y detenemos el proceso.
      if (!paymentResult.success) {
        Alert.alert(
          t('checkout:errors.paymentDeclinedTitle'),
          t('checkout:errors.paymentDeclinedMessage'), // Usaremos una traducción genérica
        );
        // Importante: salimos de la función aquí.
        return;
      }

      // Construcción del payload del pedido usando los valores memoizados
      const orderPayload: Omit<
        Order,
        'id' | 'status' | 'createdAt' | 'updatedAt'
      > = {
        userId: user!.id,
        items: cartItems,
        shippingMethod: data.shippingMethod,
        shippingAddress:
          data.shippingMethod === 'delivery'
            ? (selectedAddress ?? undefined)
            : undefined,
        pickupLocation:
          data.shippingMethod === 'pickup'
            ? (selectedPickupLocation ?? undefined)
            : undefined,
        pickupContact:
          data.shippingMethod === 'pickup' &&
          data.pickupName &&
          data.pickupEmail &&
          data.pickupPhone
            ? {
                name: data.pickupName,
                email: data.pickupEmail,
                phone: data.pickupPhone,
              }
            : undefined,
        subtotal: cartTotal,
        shippingCost: shippingCost,
        totalAmount: finalTotal,
        taxAmount: taxAmount,
      };

      const createdOrder = await orderService.createOrder(
        orderPayload,
        token ?? undefined,
      );
      // Lógica post-pedido
      await clearCart();
      Toast.show({
        type: 'success',
        text1: t('checkout:orderConfirmedTitle'),
        text2: t('checkout:orderConfirmedMessage', {
          orderId: createdOrder.id.substring(0, 8),
        }),
      });
      navigation.navigate('MainTabs', {
        screen: 'HomeTab',
        params: { screen: 'HomeScreen' },
      });
    } catch (error: any) {
      Alert.alert(
        t('checkout:errors.createOrderTitle'),
        error.message || t('checkout:errors.genericCreateOrderError'),
      );
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  // --- SECCIÓN 6: Handlers para la UI ---

  const handleSelectCard = (method: PaymentMethod) => {
    setValue('selectedCardId', method.id, { shouldValidate: true });
  };

  const handleDeleteCard = (method: PaymentMethod) => {
    Alert.alert(
      t('payments:delete.title'),
      t('payments:delete.message', { last4: method.last4 }),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('common:delete'),
          style: 'destructive',
          onPress: () => {
            setMutatingCardId(method.id);
            deleteMethod(method.id, {
              onSettled: () => setMutatingCardId(null),
            });
          },
        },
      ],
    );
  };

  // Handlers para la UI
  const handleSelectMethod = (method: 'delivery' | 'pickup') => {
    setValue('shippingMethod', method, { shouldValidate: true });
  };

  const handleSelectPickupLocation = (location: PickupLocation | null) => {
    setValue('pickupLocationId', location?.id, { shouldValidate: true });
  };

  // Devolvemos todo lo que el componente de UI necesita
  return {
    // Formulario y datos principales
    methods,
    cartItems,
    cartTotal,
    selectedAddress,
    isConfirmingOrder,

    // Datos y handlers para el método de envío
    selectedMethod,
    handleSelectMethod,

    // Datos y handlers para recogida
    pickupLocations,
    loadingPickup,
    errorPickup,
    handleSelectPickupLocation,
    selectedPickupLocation,

    // Datos y handlers para métodos de pago
    paymentMethods,
    isLoadingPaymentMethods,
    mutatingCardId,
    handleSelectCard,
    handleDeleteCard,

    // Valores calculados para el resumen
    shippingCost,
    taxAmount,
    finalTotal,

    // El handler principal de confirmación
    handleConfirmOrder: handleSubmit(onConfirmOrder),
  };
};
