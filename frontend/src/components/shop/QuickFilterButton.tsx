import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import { IconFactory } from '../icons/IconFactory'; // Usaremos nuestra fábrica de iconos

interface QuickFilterButtonProps {
  label: string;
  iconName: string;
  isSelected: boolean;
  onPress: () => void;
}

const QuickFilterButton: React.FC<QuickFilterButtonProps> = ({
  label,
  iconName,
  isSelected,
  onPress
}) => {
  // Animación de escala para el feedback táctil
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isSelected ? 1 : 0.95, { damping: 15 }) }]
    };
  });

  // Estilo animado para el fondo del icono
  const animatedIconBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(
        isSelected ? COLORS.separator : COLORS.lightGray
      )
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <Animated.View style={[styles.iconBackground, animatedIconBgStyle]}>
          <IconFactory
            name={iconName}
            size={moderateScale(32)}
            color={isSelected ? COLORS.primaryText : COLORS.primaryText}
            weight="regular"
          />
        </Animated.View>
        <Animated.Text
          style={[styles.labelText, isSelected && styles.selectedLabelText]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: moderateScale(80), // Ancho fijo para cada botón
    marginHorizontal: moderateScale(4)
  },
  iconBackground: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30), // Círculo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8)
  },
  labelText: {
    fontSize: moderateScale(13),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.secondaryText,
    fontWeight: '500',
    textAlign: 'center'
  },
  selectedLabelText: {
    color: COLORS.primaryText,
    fontWeight: '600'
  }
});

export default QuickFilterButton;
