import React from 'react';
import { moderateScale } from '../../utils/scaling';
import { CreditCardIcon } from 'phosphor-react-native';
import { COLORS } from '../../constants/colors';

// --- Importa todos los logos que planeas usar ---
import VisaLogo from '../../../assets/images/logos/visaLogo.svg';
import MastercardLogo from '../../../assets/images/logos/masterCardLogo.svg';
import AmexLogo from '../../../assets/images/logos/americanExpressLogo.svg';
// import GoogleLogo from '../../../assets/icons/brands/google.svg'; // Ejemplo para el futuro
// import FacebookLogo from '../../../assets/icons/brands/facebook.svg'; // Ejemplo para el futuro

// ✨ 1. CREAMOS UN TIPO PARA LAS MARCAS SOPORTADAS ✨
// Esto nos da autocompletado y seguridad de tipos.
export type BrandName =
  | 'Visa'
  | 'Mastercard'
  | 'American Express'
  | 'Discover'
  | 'Google'
  | 'Facebook'
  | 'Unknown';

interface BrandIconProps {
  brand: BrandName;
  width: number;
  height?: number; // Hacemos la altura opcional para logos cuadrados
}

/**
 * Un componente que renderiza el logo de una marca específica (tarjeta, social, etc.).
 * @param {BrandName} brand - El nombre de la marca a renderizar.
 * @param {number} width - El ancho del icono.
 * @param {number} [height] - La altura opcional. Si no se provee, se calcula un ratio.
 */
const BrandIcon: React.FC<BrandIconProps> = ({ brand, width, height }) => {
  const iconHeight = height || width * 0.63; // Ratio por defecto para tarjetas

  switch (brand) {
    case 'Visa':
      return <VisaLogo width={width} height={iconHeight} />;
    case 'Mastercard':
      return <MastercardLogo width={width} height={iconHeight} />;
    case 'American Express':
      return <AmexLogo width={width} height={iconHeight} />;
    // case 'Google':
    //   return <GoogleLogo width={width} height={width} />; // Logos cuadrados
    // case 'Facebook':
    //   return <FacebookLogo width={width} height={width} />;
    default:
      // Un fallback genérico y seguro
      return (
        <CreditCardIcon
          size={moderateScale(width)}
          color={COLORS.primaryText}
        />
      );
  }
};

export default BrandIcon;
