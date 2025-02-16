import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, RefreshControl, Dimensions, ScrollView } from 'react-native';
import { ActivityIndicator, Text, Searchbar, Chip, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { ProductCard } from '@/components/ui/ProductCard';
import { fetchProducts, fetchCategories } from '@/store/productsSlice';
import type { RootState, AppDispatch } from '@/store';
import { Colors } from '@/theme/colors';
import Animated, { 
  FadeInDown, 
  FadeOut,
  Layout,
  SlideInRight
} from 'react-native-reanimated';

// Constants for layout calculations
const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - (COLUMN_GAP * (NUM_COLUMNS + 1))) / NUM_COLUMNS;
const DEBOUNCE_DELAY = 300; 
const ITEMS_PER_PAGE = 10; 

const AnimatedProductCard = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, categories } = useSelector((state: RootState) => state.products);
  
  // Local state management
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Update search state immediately and debounce the filtering
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        setSearchQuery(text);
        setCurrentPage(1);
      }, 500),
    []
  );

  // Handle search input
  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text); // Update UI immediately
    debouncedSearch(text); // Debounce the actual filtering
  }, [debouncedSearch]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Initial data fetch
  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      if (mounted) {
        await Promise.all([
          dispatch(fetchProducts()),
          dispatch(fetchCategories())
        ]);
      }
    };

    fetchInitialData();
    return () => { mounted = false; };
  }, [dispatch]);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query && !selectedCategory) return items;
    
    return items.filter(item => {
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  // Get paginated items based on page size
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredItems, currentPage, ITEMS_PER_PAGE]);

  const hasMore = paginatedItems.length < filteredItems.length;

  // Handler for pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await Promise.all([
      dispatch(fetchProducts()),
      dispatch(fetchCategories())
    ]);
    setRefreshing(false);
  }, [dispatch]);

  // Memoized render item function for FlatList
  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => (
    <AnimatedProductCard 
      entering={FadeInDown.delay(index * 100).springify()}
      exiting={FadeOut}
      layout={Layout.springify()}
      style={[
        styles.itemContainer,
        index % 2 === 0 ? { marginRight: COLUMN_GAP/2 } : { marginLeft: COLUMN_GAP/2 }
      ]}
    >
      <ProductCard {...item} />
    </AnimatedProductCard>
  ), []);

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

  // Error state handling
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        entering={SlideInRight.springify()}
        style={styles.header}
      >
        <Searchbar
          placeholder="Search products..."
          onChangeText={handleSearch}
          value={searchTerm}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={Colors.primary}
        />
        
        {/* Category Filter */}
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
      </Animated.View>

      {/* Product Grid */}
      <Animated.FlatList
        entering={FadeInDown}
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
            <Animated.Text 
              entering={FadeInDown}
              style={styles.noResults}
            >
              No products found
            </Animated.Text>
          ) : null
        }
      />

      {/* Loading Indicator */}
      {loading && !refreshing && (
        <Animated.View 
          entering={FadeInDown}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </Animated.View>
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