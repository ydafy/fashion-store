import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // ✨ AÑADIDO

// --- Hooks ---
import { useDebounce } from '../../hooks/useDebounce';
import { useProductSearch, Filters } from '../../hooks/useProductSearch';

// --- Componentes, Tipos y Constantes ---
import EmptyState from '../../components/common/EmptyState';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { COLORS } from '../../constants/colors';
import { moderateScale, scale, verticalScale } from '../../utils/scaling';
import {
  XIcon,
  MagnifyingGlassIcon,
  ClockCounterClockwiseIcon,
} from 'phosphor-react-native';
import TextInputBase from '../../components/common/inputs/TextInputBase';
import { ShopStackParamList } from '../../types/navigation'; // ✨ AÑADIDO

// --- Componentes Internos para mayor claridad ---

const RecentSearchList = ({
  recentSearches,
  onClear,
  onPress,
}: {
  recentSearches: string[];
  onClear: () => void;
  onPress: (term: string) => void;
}) => {
  const { t } = useTranslation();
  if (recentSearches.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('search:recent.title')}</Text>
        <TouchableOpacity onPress={onClear}>
          <Text style={styles.clearText}>{t('search:recent.clear')}</Text>
        </TouchableOpacity>
      </View>
      {recentSearches.map((term) => (
        <TouchableOpacity
          key={term}
          style={styles.suggestionItem}
          onPress={() => onPress(term)}
        >
          <ClockCounterClockwiseIcon
            size={moderateScale(20)}
            color={COLORS.secondaryText}
          />
          <Text style={styles.suggestionText}>{term}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SuggestionsList = ({
  suggestions,
  onPress,
}: {
  suggestions: string[];
  onPress: (suggestion: string) => void;
}) => {
  const renderItem: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => onPress(item)}
    >
      <MagnifyingGlassIcon
        size={moderateScale(20)}
        color={COLORS.secondaryText}
      />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={renderItem}
      keyboardShouldPersistTaps="handled"
      style={styles.suggestionListContainer}
    />
  );
};

// --- Componente Principal ---

const SearchScreen = () => {
  const { t } = useTranslation();
  // ✨ AÑADIDO: Tipado específico para la navegación
  const navigation =
    useNavigation<NativeStackNavigationProp<ShopStackParamList>>();

  // 🔄 MODIFICADO: Usamos useState para las búsquedas recientes
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'camisa blanca',
    'jordan',
    'camisa',
  ]);
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 400);

  const { suggestions, status } = useProductSearch(
    {},
    debouncedSearchTerm,
    'suggestions',
  );

  // ✨ AÑADIDO: Lógica centralizada de navegación
  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim().length === 0) return;

    // TODO: Añadir a búsquedas recientes (lógica con AsyncStorage en el futuro)
    if (!recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches.slice(0, 9)]); // Guardar hasta 10
    }

    // Navegamos a SectionScreen con el parámetro de búsqueda
    navigation.navigate('Section', {
      searchQuery: searchTerm,
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const renderContent = () => {
    if (inputValue.length === 0) {
      return (
        <RecentSearchList
          recentSearches={recentSearches}
          onClear={handleClearRecent}
          onPress={(term) => {
            setInputValue(term); // Pone el término en la barra de búsqueda
            handleSearch(term); // Y ejecuta la búsqueda inmediatamente
          }}
        />
      );
    }

    if (status === 'pending') {
      return <LoadingIndicator style={styles.centered} />;
    }

    if (status === 'success' && (suggestions || []).length === 0) {
      return (
        <EmptyState
          style={styles.centered}
          icon={
            <MagnifyingGlassIcon
              size={moderateScale(48)}
              color={COLORS.secondaryText}
            />
          }
          message={t('search:empty.title')}
          subtext={t('search:empty.subtitle', { term: debouncedSearchTerm })}
        />
      );
    }

    return (
      <SuggestionsList
        suggestions={suggestions ?? []}
        onPress={(suggestion) => handleSearch(suggestion)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TextInputBase
          placeholder={t('search:placeholder')}
          value={inputValue}
          onChangeText={setInputValue}
          autoFocus={true}
          returnKeyType="search"
          // ✨ AÑADIDO: Maneja la búsqueda desde el teclado
          onSubmitEditing={() => handleSearch(inputValue)}
          containerStyle={{ flex: 1 }}
          rightIcon={
            inputValue.length > 0 ? (
              <TouchableOpacity onPress={() => setInputValue('')}>
                <XIcon size={moderateScale(20)} color={COLORS.secondaryText} />
              </TouchableOpacity>
            ) : undefined
          }
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>{t('common:cancel')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultsContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
};

// --- Estilos (añadir uno nuevo) ---
const styles = StyleSheet.create({
  // ... (todos los estilos existentes)
  container: { flex: 1, backgroundColor: COLORS.primaryBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  cancelButton: { paddingLeft: scale(20) },
  cancelButtonText: { fontSize: moderateScale(16), color: COLORS.primaryText },
  resultsContainer: { flex: 1 },
  centered: { marginTop: verticalScale(50) },
  sectionContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: scale(15),
  },
  // ✨ AÑADIDO: Contenedor para la lista de sugerencias para un padding consistente
  suggestionListContainer: {
    paddingHorizontal: scale(15),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
  },
  clearText: {
    fontSize: moderateScale(14),
    color: COLORS.secondaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  suggestionText: {
    fontSize: moderateScale(16),
    fontFamily: 'FacultyGlyphic-Regular',
    color: COLORS.primaryText,
    marginLeft: scale(10),
  },
});

export default SearchScreen;
