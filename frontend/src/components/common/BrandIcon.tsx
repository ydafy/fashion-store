import React from 'react';
import { moderateScale } from '../../utils/scaling';
import { CreditCardIcon } from 'phosphor-react-native';
import { COLORS } from '../../constants/colors';

// --- Import all the logos you plan to use ---
import VisaLogo from '../../../assets/images/logos/visaLogo.svg';
import MastercardLogo from '../../../assets/images/logos/masterCardLogo.svg';
import AmexLogo from '../../../assets/images/logos/americanExpressLogo.svg';
// import GoogleLogo from '../../../assets/icons/brands/google.svg'; // Example for the future
// import FacebookLogo from '../../../assets/icons/brands/facebook.svg'; // Example for the future

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
  height?: number; // We make the height optional for square logos
}

/**
 * A component that renders a specific brand's logo (card, social media, etc.).
 * @param {BrandName} brand - The brand name to render.
 * @param {number} width - The width of the icon.
 * @param {number} [height] - The optional height. If not provided, a ratio is calculated.
 */
const BrandIcon: React.FC<BrandIconProps> = ({ brand, width, height }) => {
  const iconHeight = height || width * 0.63; // Default ratio for cards

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
      // A generic and safe fallback
      return (
        <CreditCardIcon
          size={moderateScale(width)}
          color={COLORS.primaryText}
        />
      );
  }
};

export default BrandIcon;
