import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, PlusCircleIcon } from 'phosphor-react-native';

// --- ✨ 1. Importaciones de Lógica y Componentes Reutilizables ✨ ---
import { useAddressModal } from '../../contexts/AddressModalContext';
import { useAddress } from '../../contexts/AddressContext';
import {
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../hooks/useAddresses';
import { Address } from '../../types/address';
import AddressListItem from '../common/AddressListItem';
import LoadingIndicator from '../common/LoadingIndicator';
import EmptyState from '../common/EmptyState';
import { COLORS } from '../../constants/colors';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from '../../utils/scaling';

const MAX_ADDRESSES = 5;

const GlobalAddressModal: React.FC = () => {
  const { t } = useTranslation();
  const { isAddressModalVisible, closeAddressModal } = useAddressModal();
  const { addresses, selectedAddress, isLoadingAddresses, selectAddress } =
    useAddress();

  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } =
    useSetDefaultAddress();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [mutatingAddressId, setMutatingAddressId] = useState<string | null>(
    null,
  );

  // --- ✨ 2. Lógica del BottomSheet (sin cambios, pero respetando la estructura) ✨ ---
  useEffect(() => {
    if (isAddressModalVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isAddressModalVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) closeAddressModal();
    },
    [closeAddressModal],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  // --- ✨ 3. Handlers de Acciones ✨ ---
  const handleSelectAddressAndClose = (address: Address) => {
    selectAddress(address);
    setTimeout(() => {
      closeAddressModal();
    }, 250);
  };

  const handleNavigateToAddAddress = () => {
    closeAddressModal();
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'AddAddress',
      },
    });
  };

  const handleNavigateToEditAddress = (addressToEdit: Address) => {
    closeAddressModal();
    navigation.navigate('MainTabs', {
      screen: 'HomeTab',
      params: {
        screen: 'EditAddress',
        params: { address: addressToEdit }, // Pasamos los parámetros a la pantalla anidada
      },
    });
  };
  const handleDeletePress = (addressToDelete: Address) => {
    Alert.alert(
      t('address:delete.confirmTitle'),
      t('address:delete.confirmMessage', { label: addressToDelete.label }),
      [
        { text: t('common:cancel'), style: 'cancel' },
        {
          text: t('address:delete.deleteButton'),
          onPress: () => {
            setMutatingAddressId(addressToDelete.id); // Inicia la mutación para este item
            deleteAddress(addressToDelete.id, {
              onSettled: () => setMutatingAddressId(null), // Termina la mutación (éxito o error)
            });
          },
          style: 'destructive',
        },
      ],
    );
  };

  const handleSetDefaultPress = (addressId: string) => {
    setMutatingAddressId(addressId);
    setDefaultAddress(addressId, {
      onSettled: () => setMutatingAddressId(null), // Termina la mutación
    });
  };
  // --- ✨ 4. Lógica de Renderizado del Contenido ✨ ---
  const renderContent = () => {
    if (isLoadingAddresses) {
      return <LoadingIndicator style={styles.centeredMessageContainer} />;
    }
    if (addresses.length === 0) {
      return (
        <EmptyState
          icon={
            <MapPinIcon size={moderateScale(48)} color={COLORS.secondaryText} />
          }
          message={t('address:modal.emptyTitle')}
          subtext={t('address:modal.emptySubtitle')}
          style={styles.centeredMessageContainer}
        />
      );
    }
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {addresses.slice(0, MAX_ADDRESSES).map((item) => (
          <AddressListItem
            key={item.id}
            address={item}
            onPress={handleSelectAddressAndClose}
            onEditPress={handleNavigateToEditAddress}
            onDeletePress={handleDeletePress}
            onSetDefaultPress={handleSetDefaultPress}
            isSelected={selectedAddress?.id === item.id}
            isMutating={mutatingAddressId === item.id}
          />
        ))}
        {addresses.length > MAX_ADDRESSES && (
          <Text style={styles.limitReachedText}>
            {t('address:modal.limitReached', { max: MAX_ADDRESSES })}
          </Text>
        )}
      </ScrollView>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['65%']}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.modalHandle}
      backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
    >
      <BottomSheetView style={styles.modalContent}>
        {/* --- Header del Modal --- */}
        <View style={styles.headerContainer}>
          <Text style={styles.modalTitle}>{t('address:modal.title')}</Text>
        </View>

        {/* --- Botón de Añadir Dirección --- */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNavigateToAddAddress}
          disabled={
            addresses.length >= MAX_ADDRESSES || isDeleting || isSettingDefault
          }
          accessibilityRole="button"
          accessibilityLabel={t('address:modal.addButton')}
          accessibilityState={{
            disabled: addresses.length >= MAX_ADDRESSES || isSettingDefault,
          }}
        >
          <PlusCircleIcon
            size={moderateScale(24)}
            weight="regular"
            color={
              addresses.length >= MAX_ADDRESSES || isSettingDefault
                ? COLORS.secondaryText
                : COLORS.accent
            }
          />
          <Text
            style={[
              styles.addButtonText,
              (addresses.length >= MAX_ADDRESSES || isSettingDefault) &&
                styles.addButtonTextDisabled,
            ]}
          >
            {t('address:modal.addButton')}
          </Text>
        </TouchableOpacity>

        {/* --- Lista de Direcciones o Estados (Carga/Error/Vacío) --- */}
        <View style={styles.listContainer}>{renderContent()}</View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

// ✨ Estilos refinados con `moderateScale` y estructura clara
const styles = StyleSheet.create({
  modalHandle: { backgroundColor: COLORS.separator, width: 50 },
  modalContent: { flex: 1, backgroundColor: COLORS.primaryBackground },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600',
    color: COLORS.primaryText,
    paddingVertical: moderateScale(15),
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  addButtonText: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    color: COLORS.accent,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
  },
  addButtonTextDisabled: { color: COLORS.secondaryText },
  listContainer: { flex: 1 }, // Contenedor para el ScrollView o los mensajes
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },

  limitReachedText: {
    fontSize: moderateScale(13),
    color: COLORS.secondaryText,
    textAlign: 'center',
    padding: moderateScale(15),
    fontStyle: 'italic',
    fontFamily: 'FacultyGlyphic-Regular',
  },
});

export default GlobalAddressModal;
