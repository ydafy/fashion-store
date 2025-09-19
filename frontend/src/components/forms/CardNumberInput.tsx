import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';

// Importamos los componentes y tipos que vamos a usar
import StyledTextInput, {
  StyledTextInputProps,
} from '../common/inputs/StyledTextInput';
import BrandIcon, { BrandName } from '../common/BrandIcon';
import { detectCardBrand, formatCardNumber } from '../../utils/cardUtils';
import { moderateScale } from '../../utils/scaling';

// Las props son las mismas que las de StyledTextInput, lo que lo hace un reemplazo directo.
interface CardNumberInputProps extends StyledTextInputProps {}

/**
 * @description Un componente de input especializado para números de tarjeta de crédito.
 * Muestra el logo de la marca dinámicamente y formatea el número con espacios.
 * Se integra perfectamente con React Hook Form gracias a `forwardRef`.
 */
const CardNumberInput = forwardRef<TextInput, CardNumberInputProps>(
  (props, ref) => {
    /**
     * @description Maneja el cambio de texto del input.
     * Formatea el número, detecta la marca y llama a la función `onChangeText` original.
     */

    const [brand, setBrand] = useState<BrandName>('Unknown');
    const handleTextChange = (text: string) => {
      const sanitized = text.replace(/\D/g, '');
      const formattedText = formatCardNumber(sanitized);

      const detectedBrand = detectCardBrand(sanitized);
      setBrand(detectedBrand);

      props.onChangeText?.(formattedText);
    };

    return (
      <StyledTextInput
        {...props}
        ref={ref} // Pasamos la ref hacia el TextInput interno
        onChangeText={handleTextChange}
        // Pasamos nuestro BrandIcon como el ícono de la derecha
        rightIcon={<BrandIcon brand={brand} width={moderateScale(32)} />}
        keyboardType="number-pad"
        maxLength={19} // 16 dígitos + 3 espacios
        autoComplete="cc-number" // Ayuda a los sistemas de autocompletado
      />
    );
  },
);

export default CardNumberInput;
