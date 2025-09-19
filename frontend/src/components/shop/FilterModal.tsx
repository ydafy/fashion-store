import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import { FunnelSimpleIcon } from 'phosphor-react-native';

import OnSaleFilter from './OnSaleFilter';
import SortByFilter from './SortByFilter';
import ColorFilter from './ColorFilter';
import SizeFilter from './SizeFilter';
import AuthButton from '../auth/AuthButton';
import { Filters, SortOption } from '../../hooks/useProductSearch';
import { FilterGroup, FilterOption } from '../../types/filter';
import { COLORS } from '../../constants/colors';
import { moderateScale, verticalScale } from '../../utils/scaling';
import PriceRangeFilter from './PriceRangeFilter';
import { useFilters } from '../../contexts/FilterContext';

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  availableFilters: FilterGroup[];
  availableColors: FilterOption[];
  availableSizes: FilterOption[];
  priceRange: { min: number; max: number } | undefined;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  availableFilters,
  availableColors,
  availableSizes,
  priceRange,
}) => {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { filters, setFilters, updateSingleFilter, clearFilters } =
    useFilters();

  // Lógica del BottomSheet (sin cambios)
  const snapPoints = useMemo(() => ['85%'], []);
  useEffect(() => {
    if (isVisible) bottomSheetModalRef.current?.present();
    else bottomSheetModalRef.current?.dismiss();
  }, [isVisible]);
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose],
  );
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  // ✨ 2. Handler para los nuevos filtros de tags dinámicos
  const handleTagSelect = (tagValue: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagValue)
      ? currentTags.filter((t) => t !== tagValue) // Si ya está, lo quitamos
      : [...currentTags, tagValue]; // Si no está, lo añadimos
    updateSingleFilter('tags', newTags.length > 0 ? newTags : undefined);
  };

  const handleOnSaleToggle = (value: boolean) =>
    updateSingleFilter('onSale', value);
  const handleSortBySelect = (option: SortOption | null) =>
    updateSingleFilter('sortBy', option || undefined);
  const handleApply = () => {
    onClose();
  };
  // ✨ Handler para el cambio de valores de precio
  const handlePriceChange = (values: [number, number]) => {
    updateSingleFilter('minPrice', values[0]);
    updateSingleFilter('maxPrice', values[1]);
  };
  const handleClear = () => {
    clearFilters();
    // No cerramos el modal para que el usuario vea el resultado
  };

  // ✨ Handlers para color y talla (permiten multi-selección)
  const handleColorSelect = (colorValue: string) => {
    const current = filters.colors || [];
    const newSelection = current.includes(colorValue)
      ? current.filter((c) => c !== colorValue)
      : [...current, colorValue];
    updateSingleFilter(
      'colors',
      newSelection.length > 0 ? newSelection : undefined,
    );
  };

  const handleSizeSelect = (sizeValue: string) => {
    const current = filters.sizes || [];
    const newSelection = current.includes(sizeValue)
      ? current.filter((s) => s !== sizeValue)
      : [...current, sizeValue];
    updateSingleFilter(
      'sizes',
      newSelection.length > 0 ? newSelection : undefined,
    );
  };

  // ✨ 2. Creamos una función para renderizar nuestro footer personalizado
  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View style={styles.footerContainer}>
          <AuthButton
            title={t('shop:filters.applyButton')}
            onPress={handleApply}
            icon={
              <FunnelSimpleIcon
                size={20}
                color={COLORS.primaryBackground}
                weight="regular"
              />
            }
          />
        </View>
      </BottomSheetFooter>
    ),
    [handleApply, t], // Aseguramos las dependencias
  );

  return (
    <View style={styles.contentContainer}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={['90%']}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        enableOverDrag={false}
        footerComponent={renderFooter}
        handleIndicatorStyle={{ backgroundColor: COLORS.borderDefault }}
        backgroundStyle={{ backgroundColor: COLORS.primaryBackground }}
      >
        {/* ✨ 2. El layout de 3 partes: Header, Contenido Scrollable, Footer */}

        {/* --- HEADER (FIJO) --- */}
        <View style={styles.header}>
          <Text style={styles.modalTitle}>{t('common:filter')}</Text>
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>
              {t('shop:filters.clearButton')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- CONTENIDO (SCROLLABLE) --- */}
        {/* Usamos el componente de la librería */}
        <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
          <SortByFilter
            selectedSortBy={filters.sortBy || null}
            onSelectSortBy={handleSortBySelect}
          />
          <OnSaleFilter
            isOnSale={!!filters.onSale}
            onToggle={handleOnSaleToggle}
          />
          {priceRange && (
            <PriceRangeFilter
              minLimit={priceRange.min}
              maxLimit={priceRange.max}
              currentMinValue={filters.minPrice ?? priceRange.min}
              currentMaxValue={filters.maxPrice ?? priceRange.max}
              onValuesChange={handlePriceChange}
            />
          )}
          <ColorFilter
            colors={availableColors}
            selectedColors={filters.colors || []}
            onColorSelect={handleColorSelect}
          />
          <SizeFilter
            sizes={availableSizes}
            selectedSizes={filters.sizes || []}
            onSizeSelect={handleSizeSelect}
          />
          {availableFilters.map((filterGroup) => (
            <View key={filterGroup.id} style={styles.filterSection}>
              <Text style={styles.title}>{filterGroup.name}</Text>
              <View style={styles.optionsContainer}>
                {filterGroup.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.button,
                      filters.tags?.includes(option.value) &&
                        styles.selectedButton,
                    ]}
                    onPress={() => handleTagSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        filters.tags?.includes(option.value) &&
                          styles.selectedButtonText,
                      ]}
                    >
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  clearButton: {
    position: 'absolute',
    right: moderateScale(20),
  },
  clearButtonText: {
    fontSize: moderateScale(15),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  colorCircle: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.separator,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: { borderColor: COLORS.primaryText },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(80),
  },
  filterSection: { paddingVertical: moderateScale(10) },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
    marginBottom: moderateScale(12),
  },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  button: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  selectedButton: { backgroundColor: COLORS.primaryText },
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
  },
  selectedButtonText: { color: COLORS.white },
  footer: {
    position: 'static',
    bottom: 0,
    left: 0,
    right: 0,
    alignContent: 'center',
    alignItems: 'center',
    padding: moderateScale(15),
    paddingBottom: verticalScale(50),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    backgroundColor: COLORS.primaryBackground,
  },
  footerContainer: {
    paddingHorizontal: moderateScale(25),
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
    backgroundColor: COLORS.primaryBackground,
  },
});

export default FilterModal;
