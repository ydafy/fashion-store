import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS } from '../../constants/colors';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  navigation: StackNavigationProp<RootStackParamList>;
  onSubmit?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Buscar...',
  onSubmit,
}) => {
  const handleSearchSubmit = () => {
    // Remove extra spaces at the beginning/end before "send"
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery && onSubmit) {
      // If there is text and an onSubmit function was passed
      onSubmit(trimmedQuery); // Call the onSubmit function with the text
    } else if (trimmedQuery) {
      // Default action if onSubmit is not passed (you can remove it if you don't need it)
      console.log('SearchBar onSubmit (default):', trimmedQuery);
    }
    // You could also close the keyboard here if necessary
    // Keyboard.dismiss(); // You'd need to import Keyboard from 'react-native'
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
        returnKeyType="search"
        onSubmitEditing={handleSearchSubmit}
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
    backgroundColor: COLORS.primaryBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.primaryText,
    fontFamily: 'FacultyGlyphic-Regular',
  },
  clearIcon: {
    marginLeft: 8,
    padding: 2,
  },
});

export default SearchBar;
