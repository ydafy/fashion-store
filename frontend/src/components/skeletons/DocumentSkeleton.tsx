import React from 'react';
import { View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, verticalScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

// Un componente simple que simula un título y varias líneas de texto.
const SkeletonLine = ({ width, height = 16, style }: any) => (
  <ShimmerPlaceholder
    LinearGradient={LinearGradient}
    shimmerColors={[
      COLORS.borderDefault,
      COLORS.separator,
      COLORS.borderDefault,
    ]}
    style={[{ width, height: moderateScale(height), borderRadius: 4 }, style]}
  />
);

const DocumentSkeleton = () => {
  return (
    <View>
      {/* Título */}
      <SkeletonLine
        width="60%"
        height={24}
        style={{ marginBottom: verticalScale(16) }}
      />
      {/* Párrafo */}
      <SkeletonLine width="100%" style={{ marginBottom: verticalScale(8) }} />
      <SkeletonLine width="100%" style={{ marginBottom: verticalScale(8) }} />
      <SkeletonLine width="80%" style={{ marginBottom: verticalScale(24) }} />

      {/* Subtítulo */}
      <SkeletonLine
        width="40%"
        height={20}
        style={{ marginBottom: verticalScale(12) }}
      />
      {/* Otro Párrafo */}
      <SkeletonLine width="100%" style={{ marginBottom: verticalScale(8) }} />
      <SkeletonLine width="90%" style={{ marginBottom: verticalScale(8) }} />
    </View>
  );
};

export default DocumentSkeleton;
