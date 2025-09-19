import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import Carousel, {
  ICarouselInstance,
  TAnimationStyle
} from 'react-native-reanimated-carousel';
import Reanimated, { interpolate } from 'react-native-reanimated';

import { COLORS } from '../../constants/colors'; // Ajusta la ruta

interface DynamicBrandTextProps {
  texts: string[];
  interval?: 3500; // Tiempo en ms para el autoplay
  textStyle?: StyleProp<TextStyle>; // Estilo para el texto
  containerStyle?: StyleProp<ViewStyle>; // Estilo para el contenedor del carrusel
}

const screenWidth = Dimensions.get('window').width;

const DynamicBrandText: React.FC<DynamicBrandTextProps> = ({
  texts,
  interval = 3000, // Default 3 segundos
  textStyle,
  containerStyle
}) => {
  const carouselRef = useRef<ICarouselInstance>(null);

  if (!texts || texts.length === 0) {
    return null; // No renderizar nada si no hay textos
  }
  // ✨ Definir la función de animación personalizada ✨
  const customAnimationStyle: TAnimationStyle = useCallback((value: number) => {
    'worklet'; // Importante para Reanimated

    // value:
    // 0: elemento actual en el centro
    // -1: elemento anterior (que se va por la izquierda/arriba)
    // 1: elemento siguiente (que entra por la derecha/abajo)

    const scale = interpolate(
      value,
      [-1, 0, 1], // Rango de entrada: de slide anterior a actual a siguiente
      [0.8, 1, 0.8] // Rango de salida: escala (más pequeño al entrar/salir, normal en centro)
    );
    const opacity = interpolate(
      value,
      [-0.75, 0, 0.75], // Rango de entrada para opacidad (fade in/out en los extremos)
      [0, 1, 0] // Rango de salida: opacidad
    );
    // El zIndex del ejemplo original podría ser útil si los elementos se solapan mucho,
    // pero para texto simple con fade, quizás no sea necesario.
    // const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 10]);

    return {
      transform: [{ scale }],
      opacity
      // zIndex, // Opcional
    };
  }, []);

  return (
    <View style={[styles.carouselContainer, containerStyle]}>
      <Carousel
        ref={carouselRef}
        loop // Para que vuelva al inicio después del último
        width={screenWidth * 0.8} // Ancho del carrusel (ajusta según el diseño de tu tarjeta)
        // Debería ser un poco menor que el ancho de la tarjeta AuthScreenContainer
        height={50} // Altura estimada para una línea de texto grande (ajusta)
        autoPlay={true}
        autoPlayInterval={interval}
        data={texts}
        customAnimation={customAnimationStyle}
        scrollAnimationDuration={900} // Duración de la animación de scroll/fade
        // mode="parallax" // Prueba diferentes modos
        // modeConfig={{
        //   parallaxScrollingScale: 0.9,
        //   parallaxScrollingOffset: 50,
        // }}
        // Podrías querer deshabilitar los gestos si es solo un título automático:
        // scrollEnabled={false}
        // panGestureHandlerProps={{ enableTrackpadTwoFingerGesture: false }} // Para web
        renderItem={({ item, index }) => (
          <View style={styles.textItemContainer}>
            <Text style={[styles.brandTextBase, textStyle]}>{item}</Text>
          </View>
        )}
      />
      {/* No renderizaremos Pagination.Basic para un título */}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center', // Centra el carrusel si su width es menor que el contenedor
    justifyContent: 'center',
    marginBottom: 25, // Espacio debajo del carrusel de texto
    // backgroundColor: 'lightpink', // Para debug
    height: 50 // Debe coincidir con la altura del Carousel
  },
  textItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: 'lightblue', // Para debug
  },
  brandTextBase: {
    fontSize: 34, // Tamaño base (se puede sobrescribir con textStyle)
    // fontWeight: 'bold', // Usa variante de fuente
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    textAlign: 'center'
    // Ajustar letterSpacing si es necesario para el look "WOMEN'S CLOTHING"
    // letterSpacing: 1,
  }
});

export default DynamicBrandText;
