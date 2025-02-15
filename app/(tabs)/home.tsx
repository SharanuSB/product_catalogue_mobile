import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, RefreshControl, Dimensions, ScrollView } from 'react-native';
import { ActivityIndicator, Text, Searchbar, Chip, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '@/components/ui/ProductCard';
import { fetchProducts, fetchCategories } from '@/store/productsSlice';
import type { RootState, AppDispatch } from '@/store';
import { Colors } from '@/theme/colors';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - (COLUMN_GAP * (NUM_COLUMNS + 1))) / NUM_COLUMNS;
const ITEMS_PER_PAGE = 10;

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, categories } = useSelector((state: RootState) => state.products);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    // Reset pagination when search or category changes
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await Promise.all([
      dispatch(fetchProducts()),
      dispatch(fetchCategories())
    ]);
    setRefreshing(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginatedItems = filteredItems.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = paginatedItems.length < filteredItems.length;

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setCurrentPage(prev => prev + 1);
    setLoadingMore(false);
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerContainer}>
        <Button 
          mode="contained" 
          onPress={handleLoadMore}
          loading={loadingMore}
          style={styles.loadMoreButton}
        >
          Load More
        </Button>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[
      styles.itemContainer,
      index % 2 === 0 ? { marginRight: COLUMN_GAP/2 } : { marginLeft: COLUMN_GAP/2 }
    ]}>
      <ProductCard {...item} />
    </View>
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={Colors.primary}
        />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
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

      <FlatList
        data={paginatedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.noResults}>No products found</Text>
          ) : null
        }
      />

      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
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
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
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
    paddingVertical: 4,
    gap: 8,
    flexDirection: 'row',
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
    color: Colors.surface,
  },
  list: {
    padding: COLUMN_GAP,
  },
  row: {
    justifyContent: 'flex-start',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginBottom: COLUMN_GAP,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
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
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    width: '50%',
    borderRadius: 20,
  },
}); 