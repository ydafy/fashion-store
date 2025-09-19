import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

// --- Contextos y Hooks ---
import { useAddress } from '../../contexts/AddressContext';
import { useAddressModal } from '../../contexts/AddressModalContext';

// --- Componentes ---
import GlobalHeader from '../../components/common/GlobalHeader';
import SectionHeader from '../../components/common/SectionHeader';
import ShippingDetailsPreview from '../../components/address/ShippingDetailsPreview';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

const ShippingInformationScreen = () => {
  const { t } = useTranslation(['profile', 'common']);
  const { selectedAddress, addresses } = useAddress();
  const { openAddressModal } = useAddressModal();

  const hasAddresses = addresses && addresses.length > 0;

  return (
    <View style={styles.container}>
      <GlobalHeader
        title={t('profile:settings.shippingInfoTitle')}
        showBackButton
      />

      <View style={styles.content}>
        <SectionHeader
          title={t('profile:settings.shippingDetailsSection')}
          actionText={hasAddresses ? t('common:change') : t('common:add')}
          onActionPress={openAddressModal}
        />

        <ShippingDetailsPreview address={selectedAddress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  content: {
    padding: moderateScale(20),
  },
});

export default ShippingInformationScreen;
