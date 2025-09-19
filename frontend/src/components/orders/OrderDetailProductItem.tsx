import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- ✨ 1. Importaciones Clave ✨ ---
import { Image as ExpoImage } from 'expo-image';
import { CartItem } from '../../types/cart';
import {
  ProfileStackParamList,
  RootStackParamList,
} from '../../types/navigation'; // Para tipar la navegación
import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/formatters';
import { moderateScale } from '../../utils/scaling';
import Toast from 'react-native-toast-message';

const LOW_RES_PLACEHOLDER = 'L6PZfSi_.AyE_3t7t7Rj~qofbHof';

interface OrderDetailProductItemProps {
  item: CartItem;
}

const OrderDetailProductItem: React.FC<OrderDetailProductItemProps> = ({
  item,
}) => {
  const { t } = useTranslation();
  // ✨ 6. Navegación al detalle del producto ✨
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  // Buscamos el producto en el backend simulado para poder navegar a su detalle
  // En una app real, el `item` podría ya tener toda la info del producto.
  // Por ahora, asumimos que necesitamos navegar con el `productId`.
  /**
   * @description Navega a la pantalla de detalle del producto, pasando el ID del producto
   * y el ID de la variante específica que se compró.
   */
  const handlePress = () => {
    navigation.push('ProductDetail', {
      productId: item.productId,
      initialVariantId: item.variantId,
    });
  };

  // ✨ 5. Accesibilidad ✨
  const accessibilityLabel = t('orders:productItem.accessibilityLabel', {
    name: item.name,
    quantity: item.quantity,
    color: item.colorName,
    size: item.size,
    price: formatCurrency(item.price),
  });

  return (
    // ✨ 6. Hacemos el contenedor "tocable" ✨
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {/* --- ✨ 1. Usamos ExpoImage ✨ --- */}
      <ExpoImage
        source={{ uri: item.image }}
        style={styles.image}
        placeholder={item.blurhash || LOW_RES_PLACEHOLDER}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        {/* --- ✨ 2. Textos Internacionalizados ✨ --- */}
        <Text style={styles.detailText}>
          {`${t('orders:productItem.colorLabel')}: ${item.colorName}`}
        </Text>
        <Text style={styles.detailText}>
          {`${t('orders:productItem.sizeLabel')}: ${item.size}`}
        </Text>
        <Text style={styles.detailText}>
          {`${t('orders:productItem.quantityLabel')}: ${item.quantity}`}
        </Text>
        <Text style={styles.priceText}>
          {/* --- ✨ 3. Formato de Moneda ✨ --- */}
          {`${t('orders:productItem.priceLabel')}: ${formatCurrency(
            item.price,
          )}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// --- ✨ 4. Estilos Refinados y Responsivos ✨ ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
    backgroundColor: COLORS.white,
  },
  image: {
    width: moderateScale(90),
    height: moderateScale(120),
    borderRadius: moderateScale(8),
    marginRight: moderateScale(15),
    backgroundColor: COLORS.secondaryText,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(8),
  },
  detailText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    lineHeight: moderateScale(20),
  },
  priceText: {
    fontSize: moderateScale(14),
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
    marginTop: moderateScale(4),
  },
});

export default OrderDetailProductItem;
