import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Guías basadas en el tamaño de pantalla base del diseño (ej. iPhone X)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
