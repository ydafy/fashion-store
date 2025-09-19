import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Importaciones de Lógica y Tipos ---
import { useProductSearch, Filters } from '../../hooks/useProductSearch';
import { useCategoryFilters } from '../../hooks/useCategoryFilters';
import { RootStackParamList, ShopStackParamList } from '../../types/navigation';
import { COLORS } from '../../constants/colors';
import { moderateScale } from '../../utils/scaling';
import { useFilters } from '../../contexts/FilterContext';

// --- Importaciones de Iconos y Componentes ---
import { MagnifyingGlassIcon, FunnelIcon } from 'phosphor-react-native';
import GlobalHeader, {
  HeaderAction,
} from '../../components/common/GlobalHeader';
import ProductGrid from '../../components/shop/ProductGrid';
import FilterModal from '../../components/shop/FilterModal';
import QuickFilterScrollView from '../../components/shop/QuickFilterScrollView';

type SectionScreenRouteProp = RouteProp<ShopStackParamList, 'Section'>;

const SectionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<SectionScreenRouteProp>();
  const prevParamsRef = useRef<{ categoryId?: string; filterPayload?: any }>(
    {},
  );
  const prevCategoryIdRef = useRef<string | undefined>();

  const {
    categoryId: categoryIdFromParams,
    title: titleFromParams,
    searchQuery: searchQueryFromParams,
    isNew: isNewFromParams,
    shouldResetFilters,
    filterPayload,
  } = route.params || {};

  const { filters, setFilters, setInitialFilters, updateSingleFilter } =
    useFilters();

  const [searchTerm, setSearchTerm] = useState(searchQueryFromParams || '');

  useEffect(() => {
    const getBaseFiltersFromRoute = () => {
      if (filterPayload) {
        return filterPayload;
      }
      if (shouldResetFilters) {
        return {
          isNew: true,
          sortBy: { field: 'dateAdded', order: 'desc' },
        };
      }
      if (categoryIdFromParams) {
        return { categoryId: categoryIdFromParams };
      }
      return {};
    };

    // Actualizamos el estado global de filtros desde el contexto
    const baseFilters = getBaseFiltersFromRoute();
    if (Object.keys(baseFilters).length > 0) {
      setInitialFilters(baseFilters); // ✨ Establecer filtros iniciales
      setFilters(baseFilters);
    }

    setSearchTerm(searchQueryFromParams || '');
  }, [
    categoryIdFromParams,
    filterPayload,
    isNewFromParams,
    searchQueryFromParams,
    shouldResetFilters,
    setFilters,
    setInitialFilters,
  ]);

  // --- Hook de Fetching de Datos ---
  const {
    products,
    isLoading,
    error,
    retrySearch,
    availableFilters,
    priceRange,
  } = useProductSearch(searchTerm);

  // Este useEffect ya no es necesario porque el estado global se maneja en el useEffect anterior

  // --- Estado de la UI ---
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // --- Hooks de Lógica de UI ---
  const { quickFilters, modalFilters: categoryModalFilters } =
    useCategoryFilters(filters.categoryId);

  const modalFilterDefinitions = useMemo(() => {
    if (availableFilters?.modalFilters) {
      return availableFilters.modalFilters;
    }
    return categoryModalFilters;
  }, [availableFilters, categoryModalFilters]);

  const areFiltersActive = useMemo(() => {
    if ((filters.tags?.length || 0) > 0) return true;
    if ((filters.colors?.length || 0) > 0) return true;
    if ((filters.sizes?.length || 0) > 0) return true;
    if (filters.onSale) return true;
    if (priceRange) {
      if (filters.minPrice && filters.minPrice > priceRange.min) return true;
      if (filters.maxPrice && filters.maxPrice < priceRange.max) return true;
    }
    return false;
  }, [filters, priceRange]);

  // --- Handlers ---
  const handleTagSelect = (tagValue: string | null) => {
    if (tagValue === null || (filters.tags && filters.tags[0] === tagValue)) {
      // Eliminamos la propiedad 'tags' del objeto de filtros
      const newFilters = { ...filters };
      delete newFilters.tags;
      setFilters(newFilters);
    } else {
      // Establecemos el nuevo tag como el único en el array
      updateSingleFilter('tags', [tagValue]);
    }
  };

  // handleApplyModalFilters ya no es necesario - FilterModal actualiza directamente el contexto

  // --- Header ---
  useLayoutEffect(() => {
    const dynamicTitle = searchTerm ? `"${searchTerm}"` : titleFromParams || '';

    const rightActions: HeaderAction[] = [
      {
        icon: (
          <MagnifyingGlassIcon
            size={moderateScale(24)}
            color={COLORS.primaryText}
            weight="bold"
          />
        ),
        onPress: () => navigation.navigate('SearchScreen' as never),
        accessibilityLabelKey: 'common:search',
      },
      {
        icon: (
          <FunnelIcon
            size={moderateScale(24)}
            color={COLORS.primaryText}
            weight="regular"
          />
        ),
        onPress: () => setIsFilterModalVisible(true),
        accessibilityLabelKey: 'common:filter',
        hasIndicator: areFiltersActive,
      },
    ];

    navigation.setOptions({
      header: () => (
        <GlobalHeader
          title={dynamicTitle}
          showBackButton={true}
          rightActions={rightActions}
        />
      ),
      headerShown: true,
    });
  }, [navigation, t, titleFromParams, searchTerm, areFiltersActive]);

  // --- Renderizado ---
  return (
    <View style={styles.container}>
      {filters.categoryId && (
        <QuickFilterScrollView
          quickFilterGroups={quickFilters}
          selectedTags={filters.tags || []}
          onTagSelect={handleTagSelect}
        />
      )}

      <ProductGrid
        products={products || []}
        isLoading={isLoading}
        error={error?.message || null}
        onRetry={() => retrySearch?.()}
      />

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        availableFilters={modalFilterDefinitions || []}
        availableColors={availableFilters?.colors || []}
        availableSizes={availableFilters?.sizes || []}
        priceRange={priceRange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
});

export default SectionScreen;
