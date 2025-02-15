import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, RefreshControl, ScrollView } from 'react-native';
import { ActivityIndicator, Text, Chip, Searchbar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '@/components/ui/ProductCard';
import { fetchProducts, fetchCategories } from '@/store/productsSlice';
import type { RootState, AppDispatch } from '@/store';
import { Colors } from '@/theme/colors';

const ITEMS_PER_PAGE = 8;

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, categories } = useSelector((state: RootState) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedItems = filteredItems.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginatedItems.length < filteredItems.length;

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts());
    setRefreshing(false);
    setPage(1);
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={Colors.primary}
        />
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
          >
            <Chip
              selected={selectedCategory === ''}
              onPress={() => setSelectedCategory('')}
              style={[
                styles.chip,
                selectedCategory === '' && styles.selectedChip
              ]}
              textStyle={[
                styles.chipText,
                selectedCategory === '' && styles.selectedChipText
              ]}
            >
              All
            </Chip>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.chip,
                  selectedCategory === category && styles.selectedChip
                ]}
                textStyle={[
                  styles.chipText,
                  selectedCategory === category && styles.selectedChipText
                ]}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>
      </Surface>

      <FlatList
        data={paginatedItems}
        renderItem={({ item }) => <ProductCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noResults}>No products found</Text>
          ) : null
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    elevation: 4,
    backgroundColor: Colors.card,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    color: Colors.onSurface,
  },
  filterContainer: {
    marginTop: 12,
  },
  chipContainer: {
    paddingVertical: 4,
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    color: Colors.onSurface,
  },
  selectedChipText: {
    color: Colors.background,
  },
  list: {
    padding: 8,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: Colors.error,
    textAlign: 'center',
  },
  noResults: {
    textAlign: 'center',
    padding: 20,
    color: Colors.secondaryText,
  },
}); 