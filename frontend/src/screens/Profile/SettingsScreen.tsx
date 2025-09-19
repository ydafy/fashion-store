import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// --- Tipos y Componentes ---
import { ProfileStackParamList } from '../../types/navigation';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import GlobalHeader from '../../components/common/GlobalHeader';
import SettingsSection from '../../components/profile/SettingsSection';
import SettingsRow from '../../components/profile/SettingsRow';
import LanguageSelectorModal from '../../components/modal/LanguageSelectorModal';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Settings'
>;

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { user } = useAuth();

  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  // Obtenemos el nombre completo del idioma actual
  const currentLanguage = i18n.language === 'es' ? 'Español' : 'English';

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <GlobalHeader title={t('header:settings')} showBackButton />
      ),
      headerShown: true,
    });
  }, [navigation, t]);

  // --- Handlers para las acciones (la mayoría son placeholders por ahora) ---
  const handleNavigateToPayments = () => navigation.navigate('Payments');

  const showComingSoon = () => {
    Toast.show({ type: 'info', text1: t('common:comingSoon') });
  };

  const handleOpenLanguageModal = () => {
    setIsLanguageModalVisible(true);
  };
  const handleCloseLanguageModal = () => {
    setIsLanguageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- Sección de Cuenta --- */}
        <SettingsSection title={t('profile:settings.accountSection')}>
          <SettingsRow
            label={t('profile:settings.email')}
            value={user?.email || ''}
            onPress={() => navigation.navigate('ChangeEmail')}
          />
          <SettingsRow
            label={t('profile:settings.phone')}
            value={
              user?.phone && user.phone.number
                ? `+${user.phone.callingCode} ${user.phone.number}`
                : t('common:add')
            }
            onPress={() => navigation.navigate('ChangePhone')}
          />
          <SettingsRow
            label={t('profile:settings.password')}
            onPress={() => navigation.navigate('ChangePassword')}
            isLast // Es el último de la sección
          />
        </SettingsSection>

        {/* --- Sección de Datos --- */}
        <SettingsSection title={t('profile:settings.dataSection')}>
          <SettingsRow
            label={t('profile:settings.shippingInfo')}
            //onPress={() => handleNavigate('Addresses')} // Asumiendo que tienes una pantalla 'Addresses'
            onPress={() => navigation.navigate('ShippingInformation')}
            isLast
          />
          <SettingsRow
            label={t('profile:settings.paymentInfo')}
            onPress={() => navigation.navigate('Payments')}
            isLast
          />
        </SettingsSection>

        {/* --- Sección Regional --- */}
        <SettingsSection title={t('profile:settings.regionalSection')}>
          <SettingsRow
            label={t('profile:settings.language')}
            value={currentLanguage}
            onPress={handleOpenLanguageModal}
            isLast
          />
        </SettingsSection>

        {/* --- Sección de Información --- */}
        <SettingsSection title={t('profile:settings.infoSection')}>
          <SettingsRow
            label={t('profile:settings.terms')}
            onPress={() =>
              navigation.navigate('LegalDocument', { documentType: 'terms' })
            }
          />
          <SettingsRow
            label={t('profile:settings.privacy')}
            onPress={() =>
              navigation.navigate('LegalDocument', { documentType: 'privacy' })
            }
            isLast
          />
        </SettingsSection>
      </ScrollView>
      <LanguageSelectorModal
        isVisible={isLanguageModalVisible}
        onClose={handleCloseLanguageModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
});

export default SettingsScreen;
