import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

// --- ✨ 1. Importaciones Clave ✨ ---
import { PerfilScreenProps } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useAddressModal } from '../../contexts/AddressModalContext';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

// --- Componentes Reutilizables ---
import ProfileOptionButton from '../../components/profile/ProfileOptionButton';
import AuthButton from '../../components/auth/AuthButton';
import FavoritePreviewSection from '../../components/favorites/FavoritePreviewSection';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const PerfilScreen = ({ navigation }: PerfilScreenProps) => {
  const { t } = useTranslation();
  // ✨ Renombramos `isLoading` para evitar colisión con otros `loading`
  const {
    user,
    logout,
    isLoading: isAuthLoading,
    resendVerificationEmail,
    simulateEmailVerification,
  } = useAuth();
  const { openAddressModal } = useAddressModal();

  // --- ✨ 2. Header Invisible y Dinámico ✨ ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Ocultamos completamente el header del stack navigator
    });
  }, [navigation]);

  // --- ✨ 3. Handlers de Acciones ✨ ---
  const handleLogout = () => {
    // No es necesario que sea async si no esperamos nada de él
    logout();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleNavigateToOrders = () => navigation.navigate('OrderHistory');
  const handleNavigateToSettings = () => navigation.navigate('Settings');
  const handleNavigateToHelp = () => navigation.navigate('Help');
  const handleNavigateToPayments = () => navigation.navigate('Payments');

  const handleResendEmail = async () => {
    if (resendVerificationEmail) {
      const success = await resendVerificationEmail();
      if (success) {
        Toast.show({
          type: 'success',
          text1: t('profile:alerts.verificationEmailSentTitle'),
          text2: t('profile:alerts.verificationEmailSentMessage', {
            email: user?.email || '',
          }),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('common:error'),
          text2: t('profile:alerts.verificationEmailSentError'),
        });
      }
    }
  };

  // --- ✨ 4. Renderizado del Componente ✨ ---
  return (
    // Usamos SafeAreaView para respetar el notch, pero solo en la parte superior y los lados.
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Banner de Verificación de Email --- */}
        {user && !user.isEmailVerified && (
          <View style={styles.verificationBanner}>
            <Text style={styles.verificationBannerText}>
              {t('profile:verifyEmailPrompt')}
            </Text>
            <TouchableOpacity
              onPress={handleResendEmail}
              accessibilityRole="button"
            >
              <Text style={styles.resendLinkText}>
                {t('profile:resendVerificationLink')}
              </Text>
            </TouchableOpacity>
            {__DEV__ && (
              <TouchableOpacity
                onPress={simulateEmailVerification}
                style={{ marginLeft: 10 }}
              >
                <Text
                  style={[styles.resendLinkText, { color: COLORS.success }]}
                >
                  {t('profile:simulateVerification')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* --- Header del Perfil (Avatar, Nombre, etc.) --- */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || user?.email}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            accessibilityRole="button"
            accessibilityLabel={t('profile:editProfileButton')}
          >
            <Text style={styles.editProfileButtonText}>
              {t('profile:editProfileButton')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Scroll Horizontal de Opciones --- */}
        <View style={styles.optionsScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsList}
          >
            <ProfileOptionButton
              iconName="CubeIcon"
              labelKey="profile:options.orders"
              onPress={handleNavigateToOrders}
            />
            <ProfileOptionButton
              iconName="MapPinIcon"
              labelKey="profile:options.addresses"
              onPress={openAddressModal}
            />
            <ProfileOptionButton
              iconName="CreditCard"
              labelKey="profile:options.paymentMethods"
              onPress={handleNavigateToPayments}
            />
            <ProfileOptionButton
              iconName="GearIcon"
              labelKey="profile:options.settings"
              onPress={handleNavigateToSettings}
            />
            <ProfileOptionButton
              iconName="InfoIcon"
              labelKey="profile:options.help"
              onPress={handleNavigateToHelp}
            />
          </ScrollView>
        </View>

        {/* --- Vista Previa de Favoritos --- */}
        <FavoritePreviewSection />

        {/* --- Botón Cerrar Sesión --- */}
        <View style={styles.logoutButtonContainer}>
          {isAuthLoading ? (
            <LoadingIndicator />
          ) : (
            <AuthButton
              title={t('profile:logoutButton')}
              onPress={handleLogout}
              style={styles.customLogoutButton}
              textStyle={styles.customLogoutButtonText}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- ✨ 5. Estilos Refinados y Responsivos ✨ ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: verticalScale(20), // Solo padding inferior, el superior lo da SafeAreaView
  },
  verificationBanner: {
    backgroundColor: COLORS.warningBackground,
    padding: moderateScale(15),
    marginHorizontal: moderateScale(15),
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  verificationBannerText: {
    color: COLORS.primaryText,
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
    flexShrink: 1,
    marginRight: scale(10),
  },
  resendLinkText: {
    color: COLORS.accent,
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: 'bold',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: verticalScale(30),
    paddingHorizontal: scale(20),
  },
  avatarPlaceholder: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
    borderWidth: 2,
    borderColor: COLORS.separator,
  },
  avatarLetter: {
    fontSize: moderateScale(40),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  userName: {
    fontSize: moderateScale(22),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '600',
    marginBottom: verticalScale(10),
  },
  editProfileButton: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(25),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondaryText,
  },
  editProfileButtonText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
  },
  optionsScrollContainer: {
    marginBottom: verticalScale(30),
  },
  optionsList: {
    paddingHorizontal: scale(20),
    alignItems: 'center',
  },
  logoutButtonContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  customLogoutButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  customLogoutButtonText: {
    color: COLORS.error,
  },
});

export default PerfilScreen;
