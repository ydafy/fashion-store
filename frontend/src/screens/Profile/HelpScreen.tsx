import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

// --- Tipos y Componentes ---
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import GlobalHeader from '../../components/common/GlobalHeader';
import SettingsRow from '../../components/profile/SettingsRow';
import SettingsSection from '../../components/profile/SettingsSection';

// --- Constantes y Utils ---
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

const HelpScreen = () => {
  const { t } = useTranslation(['profile']);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  return (
    <View style={styles.container}>
      <GlobalHeader title={t('options.help')} showBackButton />

      <View style={styles.content}>
        <SettingsSection>
          <SettingsRow
            label={t('help.faq')}
            onPress={() => navigation.navigate('FAQ')}
          />
          <SettingsRow
            label={t('help.contactUs')}
            onPress={() => navigation.navigate('Contact')}
            isLast
          />
        </SettingsSection>
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

export default HelpScreen;
