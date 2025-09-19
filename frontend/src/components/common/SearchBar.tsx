import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack'; // 👈 Importa StackNavigationProp
import { RootStackParamList } from '../../types/navigation'; // 👈 Importa tus tipos

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  navigation: StackNavigationProp<RootStackParamList>; // 👈 AÑADE la prop navigation
  onSubmit?: (query: string) => void; // 👈 AÑADE la prop onSubmit opcional
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Buscar...',
  navigation, // 👈 Recibe navigation
  onSubmit // 👈 Recibe onSubmit
}) => {
  const handleSearchSubmit = () => {
    // Quita espacios extra al inicio/final antes de "enviar"
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && onSubmit) {
      // Si hay texto y se pasó una función onSubmit
      onSubmit(trimmedQuery); // Llama a la función onSubmit con el texto
    } else if (trimmedQuery) {
      // Acción por defecto si no se pasa onSubmit (puedes quitarla si no la necesitas)
      console.log('SearchBar onSubmit (default):', trimmedQuery);
    }
    // Aquí podrías también cerrar el teclado si es necesario
    // Keyboard.dismiss(); // Necesitarías importar Keyboard de 'react-native'
  };

  return (
    <View style={styles.searchBarContainer}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#888"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search" // 👈 Cambia el botón del teclado a "Buscar" (o "done", "go")
        onSubmitEditing={handleSearchSubmit} // 👈 LLAMA a handleSearchSubmit al presionar Enter/Buscar
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          style={styles.clearIcon}
        >
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222121', // Usa tu color de texto principal
    fontFamily: 'FacultyGlyphic-Regular' // Aplica tu fuente si quieres
  },
  clearIcon: {
    marginLeft: 8,
    padding: 2
  }
});

export default SearchBar;
