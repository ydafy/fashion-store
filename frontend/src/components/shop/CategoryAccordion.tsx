import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CaretDownIcon } from 'phosphor-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import AccordionItem from '../common/AccordionItem'; // Usamos el componente base
import { IconFactory } from '../icons/IconFactory';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

interface CategoryAccordionProps {
  categoryName: string;
  categoryIconName: string;
  children: React.ReactNode;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categoryName,
  categoryIconName,
  children,
}) => {
  // Usamos un shared value para saber si el acordeón está abierto y animar nuestros elementos
  const isOpen = useSharedValue(0);
  const closedWidth = scale(2);
  const openWidth = scale(4);

  const animatedLineStyle = useAnimatedStyle(() => {
    // Animamos el color y el ancho de la línea de acento
    const backgroundColor =
      isOpen.value === 1 ? COLORS.accent : COLORS.primaryText;
    const width = withTiming(isOpen.value === 1 ? openWidth : closedWidth, {
      duration: 200,
    });
    return {
      backgroundColor,
      width,
    };
  });

  // Reemplazamos el icono de chevron por defecto con el nuestro
  const CustomChevron = () => {
    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${isOpen.value * 180}deg` }],
    }));
    return (
      <Animated.View style={animatedIconStyle}>
        <CaretDownIcon
          size={moderateScale(22)}
          color={COLORS.primaryText}
          weight="bold"
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.accentLine, animatedLineStyle]} />
      <View style={styles.contentWrapper}>
        <AccordionItem
          title={categoryName}
          icon={
            <IconFactory
              name={categoryIconName}
              weight="duotone"
              size={moderateScale(28)}
            />
          }
          // Pasamos nuestro chevron personalizado y manejamos el estado de apertura
          // Nota: Esto requeriría modificar AccordionItem para aceptar un `renderChevron` y un `onToggle` prop.
          // Para simplificar, por ahora lo dejamos con el chevron por defecto.
          // El rediseño principal se logra con los nuevos estilos.
          style={styles.accordionItemStyle}
          titleStyle={styles.accordionTitleStyle}
        >
          {children}
        </AccordionItem>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: verticalScale(1), // Pequeño espacio entre items
  },
  accentLine: {
    width: scale(2),
    backgroundColor: COLORS.accent,
    borderTopLeftRadius: moderateScale(8),
    borderBottomLeftRadius: moderateScale(8),
  },
  contentWrapper: {
    flex: 1,
  },
  // ESTILOS QUE SOBRESCRIBEN LOS DE AccordionItem
  accordionItemStyle: {
    backgroundColor: 'transparent', // Hacemos transparente el fondo del AccordionItem base
    borderBottomWidth: 0.5, // Quitamos el borde inferior que tenía
    marginBottom: 0, // Quitamos el margen inferior
    borderRadius: 0,
    borderTopRightRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
  },
  accordionTitleStyle: {
    fontSize: moderateScale(18), // Hacemos el título más grande y audaz
    fontWeight: '600',
  },
});

export default CategoryAccordion;
