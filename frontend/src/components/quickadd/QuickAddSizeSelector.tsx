import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';

// ✨ 1. Importamos el nuevo tipo que vamos a usar
import { InventoryItem } from '../../types/product';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';

// ✨ 2. Actualizamos las props para trabajar con el inventario y los IDs
interface QuickAddSizeSelectorProps {
  inventory: InventoryItem[];
  selectedInventoryId: string | null;
  onSizeSelect: (inventoryId: string) => void;
}

const QuickAddSizeSelector: React.FC<QuickAddSizeSelectorProps> = ({
  inventory,
  selectedInventoryId,
  onSizeSelect
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('quickadd:sizeTitle')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {/* ✨ 3. Iteramos sobre 'inventory' en lugar de 'sizes' */}
        {inventory.map((item) => {
          const isSelected = selectedInventoryId === item.id;
          const isAvailable = item.stock > 0; // ✨ Lógica de disponibilidad simplificada

          return (
            <TouchableOpacity
              key={item.id} // ✨ Usamos el ID único como key
              style={[
                styles.sizeButton,
                isSelected && styles.selectedSizeButton,
                !isAvailable && styles.disabledSizeButton
              ]}
              // ✨ La función onPress ahora pasa el ID del item
              onPress={() => isAvailable && onSizeSelect(item.id)}
              disabled={!isAvailable}
              accessibilityRole="radio"
              accessibilityState={{
                selected: isSelected,
                disabled: !isAvailable
              }}
              accessibilityLabel={String(item.size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  isSelected && styles.selectedSizeText,
                  !isAvailable && styles.disabledSizeText
                ]}
              >
                {/* ✨ Mostramos el tamaño del item */}
                {item.size}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// --- ESTILOS ORIGINALES (SIN MODIFICACIONES) ---
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10)
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: verticalScale(12)
  },
  listContainer: {
    paddingRight: scale(20)
  },
  sizeButton: {
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(18),
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedSizeButton: {
    backgroundColor: COLORS.primaryText,
    borderColor: COLORS.primaryText
  },
  disabledSizeButton: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.5
  },
  sizeText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText
  },
  selectedSizeText: {
    color: COLORS.white
  },
  disabledSizeText: {
    textDecorationLine: 'line-through',
    color: COLORS.secondaryText
  }
});

export default QuickAddSizeSelector;
