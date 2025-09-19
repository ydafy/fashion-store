import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

// ✨ 1. Importamos los nuevos iconos y eliminamos Ionicons
import { CaretDownIcon, ArrowLeftIcon } from 'phosphor-react-native';

import { useAddress, useAddressModal } from '../../contexts';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

export interface CustomHeaderProps {
  // 👈 AÑADE export
  showAddress?: boolean;
  showFavorites?: boolean;
  onAddressPress?: () => void;
  onFavoritesPress?: () => void;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void; // Permitir un back press personalizado
  showShareButton?: boolean;
  onSharePress?: () => void;
  addressText?: string;
}

// --- ✨ 2. Definición de Tipos Actualizada ✨ ---
export interface HeaderAction {
  icon: React.ReactElement; // Ahora espera un elemento React completo
  onPress: () => void;
  accessibilityLabelKey: string;
  hasIndicator?: boolean;
}

interface GlobalHeaderProps {
  title?: string;
  titleOpacity?: Animated.SharedValue<number>;
  showBackButton?: boolean;
  showAddressSelector?: boolean;
  rightActions?: HeaderAction[];
}

// --- Sub-componente AddressSelector (con icono actualizado) ---
const AddressSelector = () => {
  const { t } = useTranslation();
  const { selectedAddress } = useAddress();
  const { openAddressModal } = useAddressModal();
  const displayAddressText =
    selectedAddress?.label || t('header:selectAddressPrompt');

  return (
    <TouchableOpacity
      onPress={openAddressModal}
      style={styles.addressTouchable}
      accessibilityRole="button"
      accessibilityLabel={t('header:addressActionLabel', {
        address: displayAddressText,
      })}
    >
      <Text style={styles.addressText} numberOfLines={1}>
        {displayAddressText}
      </Text>
      {/* ✨ Icono actualizado a Phosphor */}
      <CaretDownIcon
        size={moderateScale(20)}
        color={COLORS.primaryText}
        weight="regular"
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
};

// --- Componente Principal GlobalHeader ---
const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  title,
  titleOpacity,
  showBackButton = false,
  showAddressSelector = false,
  rightActions = [],
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const animatedTitleStyle = useAnimatedStyle(
    () => ({
      opacity: titleOpacity ? titleOpacity.value : 1,
    }),
    [titleOpacity],
  );

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={t('product:detail.header.backButtonLabel')} // Asumiendo que esta clave existe
            >
              {/* ✨ Icono de "atrás" actualizado a Phosphor */}
              <ArrowLeftIcon
                size={moderateScale(26)}
                color={COLORS.primaryText}
                weight="regular"
              />
            </TouchableOpacity>
          )}
          {showAddressSelector && <AddressSelector />}
        </View>

        <View style={styles.centerContainer}>
          {title && (
            <Animated.Text
              style={[styles.titleText, animatedTitleStyle]}
              numberOfLines={1}
            >
              {title}
            </Animated.Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={t(action.accessibilityLabelKey)}
            >
              {/* ✨ 3. Renderizamos directamente el icono que nos pasan */}
              {action.icon}
              {action.hasIndicator && <View style={styles.indicatorDot} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// --- ✨ 3. Estilos Unificados ✨ ---
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(10),
    height: verticalScale(50),
  },

  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',

    minWidth: scale(50),
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    marginHorizontal: scale(8),
  },
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: scale(50),
  },
  iconButton: {
    padding: scale(8),
  },
  indicatorDot: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: COLORS.error,
    borderWidth: 1,
    borderColor: COLORS.primaryBackground,
  },
  titleText: {
    fontSize: moderateScale(18),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '500',

    textAlign: 'center',
  },
  // Estilos para AddressSelector
  addressTouchable: {
    flexDirection: 'row',
    alignItems: 'center',

    flexShrink: 1,
  },
  addressText: {
    fontSize: moderateScale(15),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    fontWeight: '500',
  },
  arrowIcon: {
    marginLeft: scale(3),
  },
});

export default GlobalHeader;
