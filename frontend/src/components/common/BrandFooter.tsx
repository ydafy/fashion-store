import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { InstagramLogoIcon, TiktokLogoIcon } from 'phosphor-react-native';

import { COLORS } from '../../constants/colors';
import { verticalScale, moderateScale, scale } from '../../utils/scaling';
//import BrandIcon from './BrandIcon';

const INSTAGRAM_URL = 'https://www.instagram.com/tu_usuario';
const TIKTOK_URL = 'https://www.tiktok.com/@tu_usuario';

const BrandFooter: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <View style={styles.container}>
      {/* <BrandIcon size={moderateScale(60)} /> Here goes the brand icon */}
      <Text style={styles.slogan}>{t('footer.slogan')}</Text>
      <View style={styles.socialsContainer}>
        <TouchableOpacity onPress={() => Linking.openURL(INSTAGRAM_URL)}>
          <InstagramLogoIcon
            size={moderateScale(32)}
            color={COLORS.secondaryText}
            weight="light"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(TIKTOK_URL)}>
          <TiktokLogoIcon
            size={moderateScale(32)}
            color={COLORS.secondaryText}
            weight="light"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.copyright}>
        {t('footer.copyright', {
          year: new Date().getFullYear(),
          brandName: 'Tu Marca',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    paddingHorizontal: moderateScale(20),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    marginTop: verticalScale(20),
  },
  slogan: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(16),
    color: COLORS.primaryText,
    marginTop: verticalScale(15),
    textAlign: 'center',
  },
  socialsContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(20),
    gap: scale(25),
  },
  copyright: {
    fontFamily: 'FacultyGlyphic-Regular',
    fontSize: moderateScale(12),
    color: COLORS.secondaryText,
    marginTop: verticalScale(30),
    textAlign: 'center',
  },
});

export default BrandFooter;
