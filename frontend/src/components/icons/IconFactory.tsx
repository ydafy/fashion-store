import React from 'react';
import * as PhosphorIcons from 'phosphor-react-native';
import { moderateScale } from '../../utils/scaling';
import { COLORS } from '../../constants/colors';

// Mapeo para acceder a los iconos por su nombre como string
const IconMap = PhosphorIcons as unknown as Record<
  string,
  React.ComponentType<PhosphorIcons.IconProps>
>;

interface IconFactoryProps {
  name: string;
  size?: number;
  color?: string;
  weight?: PhosphorIcons.IconWeight;
}

export const IconFactory: React.FC<IconFactoryProps> = ({
  name,
  size = moderateScale(26),
  color = COLORS.primaryText,
  weight = 'regular',
}) => {
  // Buscamos el componente del icono en nuestro mapa
  const IconComponent = IconMap[name];

  if (!IconComponent) {
    // Fallback por si el nombre del icono del backend no existe en la librería
    console.warn(`Icono "${name}" no encontrado.`);
    return (
      <PhosphorIcons.QuestionIcon size={size} color={color} weight={weight} />
    );
  }

  return <IconComponent size={size} color={color} weight={weight} />;
};
