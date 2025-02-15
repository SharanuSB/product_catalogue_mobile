import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { Searchbar, Surface, Text } from 'react-native-paper';
import { useAppTheme } from '@/theme/ThemeContext';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CustomChip = ({ 
  label, 
  selected, 
  onPress,
  theme 
}: { 
  label: string; 
  selected: boolean; 
  onPress: () => void;
  theme: any;
}) => (
  <Pressable onPress={onPress}>
    <Surface
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : 'transparent',
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: selected ? '#fff' : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </Surface>
  </Pressable>
);

export const SearchHeader = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategorySelect,
}: SearchHeaderProps) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.primary}
        placeholderTextColor={theme.colors.secondaryText}
        inputStyle={{ color: theme.colors.text }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <CustomChip
          label="All"
          selected={selectedCategory === ''}
          onPress={() => onCategorySelect('')}
          theme={theme}
        />
        {categories.map((category) => (
          <CustomChip
            key={category}
            label={category}
            selected={selectedCategory === category}
            onPress={() => onCategorySelect(category)}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchBar: {
    elevation: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  categoriesContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 0,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 