import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '@/components/ui/ProductCard';
import { SearchHeader } from '@/components/ui/SearchHeader';
import { 
  fetchProducts, 
  fetchCategories,
  setSearchQuery,
  setCategory,
  setCurrentPage 
} from '@/store/productsSlice';
import type { RootState, AppDispatch } from '@/store';

const ITEMS_PER_PAGE = 10;

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    filteredItems, 
    loading, 
    error, 
    currentPage,
    searchQuery,
    selectedCategory,
    categories 
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleLoadMore = () => {
    if (currentPage * ITEMS_PER_PAGE < filteredItems.length) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handleRefresh = () => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={(query) => dispatch(setSearchQuery(query))}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => dispatch(setCategory(category))}
      />

      <FlatList
        data={paginatedItems}
        renderItem={({ item }) => (
          <ProductCard
            {...item}
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noResults}>No products found</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  loader: {
    padding: 20,
  },
  noResults: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
}); 