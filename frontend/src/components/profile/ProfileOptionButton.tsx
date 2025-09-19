import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';

// ✨ AÑADIDO: Importamos el componente IconFactory y los tipos necesarios
import { IconFactory } from '../icons/IconFactory';
import { IconProps } from 'phosphor-react-native';

import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

interface ProfileOptionButtonProps {
  /**
   * El nombre del icono de Phosphor a mostrar.
   */
  iconName: string; // Ahora aceptamos cualquier string, ya que IconFactory tiene un fallback.
  /**
   * La clave de traducción para la etiqueta del botón.
   */
  labelKey: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconProps?: Omit<IconProps, 'name'>; // Mantenemos la flexibilidad
}

const ProfileOptionButton: React.FC<ProfileOptionButtonProps> = ({
  iconName,
  labelKey,
  onPress,
  containerStyle,
  iconProps = { size: 28, weight: 'regular' },
}) => {
  const { t } = useTranslation();
  const label = t(labelKey);

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.iconContainer}>
        {/* 🔻 LA MAGIA: Usamos el componente IconFactory directamente 🔻 */}
        <IconFactory
          name={iconName}
          size={moderateScale(Number(iconProps.size) || 28)}
          color={iconProps.color || COLORS.primaryText}
          weight={iconProps.weight}
        />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(10),
    minWidth: moderateScale(85),
    marginRight: moderateScale(15),
  },
  iconContainer: {
    marginBottom: moderateScale(8),
  },
  label: {
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
});

export default ProfileOptionButton;
