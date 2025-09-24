import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Carousel, {
  ICarouselInstance,
  TAnimationStyle,
} from 'react-native-reanimated-carousel';
import Reanimated, { interpolate } from 'react-native-reanimated';

import { COLORS } from '../../constants/colors';

interface DynamicBrandTextProps {
  texts: string[];
  interval?: 3500; // Time in ms for autoplay
  textStyle?: StyleProp<TextStyle>; // Style for the text
  containerStyle?: StyleProp<ViewStyle>; // Style for the carousel container
}

const screenWidth = Dimensions.get('window').width;

const DynamicBrandText: React.FC<DynamicBrandTextProps> = ({
  texts,
  interval = 3000,
  textStyle,
  containerStyle,
}) => {
  const carouselRef = useRef<ICarouselInstance>(null);

  if (!texts || texts.length === 0) {
    return null;
  }
  // Define the custom animation function
  const customAnimationStyle: TAnimationStyle = useCallback((value: number) => {
    'worklet'; // Important for Reanimated

    // value:
    // 0: current element in the center
    // -1: previous element (moving from the left/up)
    // 1: next element (moving from the right/down)

    const scale = interpolate(
      value,
      [-1, 0, 1], // Input range: from previous slide to current slide to next slide
      [0.8, 1, 0.8], // Output range: scale (smallest on entry/exit, normal in center)
    );
    const opacity = interpolate(
      value,
      [-0.75, 0, 0.75], // Input range for opacity (fade in/out at the ends)
      [0, 1, 0], // Output range: opacity
    );
    // The zIndex from the original example might be useful if the elements overlap a lot,
    // but for simple faded text, it might not be necessary.
    // const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 10]);

    return {
      transform: [{ scale }],
      opacity,
      // zIndex, // Optional
    };
  }, []);

  return (
    <View style={[styles.carouselContainer, containerStyle]}>
      <Carousel
        ref={carouselRef}
        loop
        width={screenWidth * 0.8}
        height={50}
        autoPlay={true}
        autoPlayInterval={interval}
        data={texts}
        customAnimation={customAnimationStyle}
        scrollAnimationDuration={900}
        // mode="parallax" // Different modes
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
      {/* We will not render Pagination.Basic for a title */}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center', // Center the carousel if its width is smaller than the container
    justifyContent: 'center',
    marginBottom: 25,
    height: 50,
  },
  textItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTextBase: {
    fontSize: 34,
    // fontWeight: 'bold', // Usa variante de fuente
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    textAlign: 'center',
    // Adjust letter spacing if needed for the "women's clothing" look
    // letterSpacing: 1,
  },
});

export default DynamicBrandText;
