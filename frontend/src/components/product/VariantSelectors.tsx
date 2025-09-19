import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

// ✨ 1. Importamos los nuevos tipos que vamos a usar
import { ProductVariant, InventoryItem } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';

// ✨ 2. Actualizamos las props para que sean más robustas y usen IDs
interface VariantSelectorsProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  selectedInventoryId: string | null;
  onVariantSelect: (variantId: string) => void;
  onSizeSelect: (inventoryId: string) => void;
  // productName ya no es necesario, lo eliminamos para simplificar
}

const VariantSelectors: React.FC<VariantSelectorsProps> = ({
  variants,
  selectedVariantId,
  selectedInventoryId,
  onVariantSelect,
  onSizeSelect
}) => {
  const { t } = useTranslation();

  // ✨ 3. La lógica ahora usa los IDs para encontrar los elementos correctos
  const currentVariant = variants.find((v) => v.id === selectedVariantId);
  const availableInventory = currentVariant?.inventory || [];

  // ✨ 4. La lógica de disponibilidad ahora se basa en el nuevo 'inventory'
  const isVariantInStock = (variant: ProductVariant): boolean => {
    return variant.inventory.some((item) => item.stock > 0);
  };

  return (
    <View style={styles.container}>
      {/* --- Columna de Colores --- */}
      <View style={styles.column}>
        <Text style={styles.title}>
          {t('product:detail.variants.colorsTitle')}
        </Text>
        <View style={styles.selectorContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.selectorList}
          >
            {variants.map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              const isInStock = isVariantInStock(variant);
              const accessibilityLabel = t(
                'product:detail.variants.colorAccessibilityLabel',
                {
                  colorName: variant.colorName,
                  status: isSelected
                    ? t('common:selected')
                    : isInStock
                    ? t('common:available')
                    : t('common:unavailable')
                }
              );

              return (
                <TouchableOpacity
                  key={variant.id} // ✨ Usamos el ID único de la variante
                  onPress={() => onVariantSelect(variant.id)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: variant.colorCode },
                    isSelected && styles.selectedCircle,
                    !isInStock && !isSelected && styles.unavailableOption
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={accessibilityLabel}
                />
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* --- Columna de Tallas --- */}
      <View style={styles.column}>
        <Text style={styles.title}>
          {t('product:detail.variants.sizesTitle')}
        </Text>
        <View style={styles.selectorContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.selectorList}
          >
            {/* ✨ 5. Iteramos sobre 'availableInventory' y usamos las propiedades correctas */}
            {availableInventory.map((item: InventoryItem) => {
              const isSelected = selectedInventoryId === item.id;
              const isAvailable = item.stock > 0; // ✨ Lógica de disponibilidad simplificada
              const accessibilityLabel = t(
                'product:variants.sizeAccessibilityLabel',
                {
                  sizeName: item.size,
                  status: isSelected
                    ? t('common:selected')
                    : isAvailable
                    ? t('common:available')
                    : t('common:unavailable')
                }
              );

              return (
                <TouchableOpacity
                  key={item.id} // ✨ Usamos el ID único del item de inventario
                  onPress={() => onSizeSelect(item.id)}
                  style={[
                    styles.sizeCircle,
                    isSelected && styles.selectedCircle,
                    !isAvailable && styles.unavailableOption
                  ]}
                  disabled={!isAvailable}
                  accessibilityRole="radio"
                  accessibilityState={{
                    selected: isSelected,
                    disabled: !isAvailable
                  }}
                  accessibilityLabel={accessibilityLabel}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      !isAvailable && styles.unavailableText
                    ]}
                  >
                    {item.size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

// --- ESTILOS ORIGINALES (SIN MODIFICACIONES) ---
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(10)
  },
  column: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(10)
  },
  selectorContainer: {
    height: moderateScale(160),
    //backgroundColor: 'red',
    width: '100%',
    alignItems: 'center'
  },
  selectorList: {
    alignItems: 'center'
  },
  colorCircle: {
    width: moderateScale(37),
    height: moderateScale(37),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(12),
    borderWidth: 2,
    borderColor: 'transparent'
  },
  sizeCircle: {
    width: moderateScale(37),
    height: moderateScale(37),
    borderRadius: moderateScale(20),
    marginBottom: moderateScale(12),
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  selectedCircle: {
    borderColor: COLORS.primaryText
  },
  sizeText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    fontWeight: '500',
    color: COLORS.primaryText
  },
  unavailableOption: {
    opacity: 0.4
  },
  unavailableText: {
    textDecorationLine: 'line-through'
  },
  allSoldOutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(10)
  },
  allSoldOutText: {
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.error,
    fontSize: moderateScale(14),
    textAlign: 'center'
  }
});

export default VariantSelectors;
