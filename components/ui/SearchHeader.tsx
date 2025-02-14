import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const SearchHeader = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategorySelect,
}: SearchHeaderProps) => {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <Chip
          mode={selectedCategory === '' ? 'flat' : 'outlined'}
          selected={selectedCategory === ''}
          onPress={() => onCategorySelect('')}
          style={styles.chip}
        >
          All
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category}
            mode={selectedCategory === category ? 'flat' : 'outlined'}
            selected={selectedCategory === category}
            onPress={() => onCategorySelect(category)}
            style={styles.chip}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  categoriesContainer: {
    paddingVertical: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
}); 