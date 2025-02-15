import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Dimensions, Pressable } from 'react-native';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Colors } from '@/theme/colors';
import { formatPrice } from '@/utils/formatPrice';

const { width } = Dimensions.get('window');

const CategoryChip = ({ label }: { label: string }) => (
  <View style={styles.categoryChip}>
    <Text style={styles.categoryText}>{label}</Text>
  </View>
);

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const product = useSelector((state: RootState) => 
    state.products.items.find(item => item.id === Number(id))
  );

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>

        <Image 
          source={{ uri: product.image }} 
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text variant="headlineSmall" style={styles.title}>
            {product.title}
          </Text>

          <View style={styles.priceRow}>
            <Text variant="headlineMedium" style={styles.price}>
              {formatPrice(product.price)}
            </Text>
            <CategoryChip label={product.category} />
          </View>

          <View style={styles.cardContainer}>
            <Surface style={styles.ratingCard}>
              <View style={styles.ratingInner}>
                <View style={styles.ratingContent}>
                  <View>
                    <Text variant="titleMedium" style={styles.ratingLabel}>Rating</Text>
                    <Text variant="displaySmall" style={styles.ratingNumber}>
                      {product.rating.rate}
                    </Text>
                  </View>
                  <View>
                    <Text variant="titleMedium" style={styles.ratingLabel}>Reviews</Text>
                    <Text variant="displaySmall" style={styles.reviewCount}>
                      {product.rating.count}
                    </Text>
                  </View>
                </View>
              </View>
            </Surface>
          </View>

          <View style={styles.descriptionContainer}>
            <Text variant="titleLarge" style={styles.descriptionTitle}>
              Description
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 8,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  image: {
    width: width,
    height: width,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.onSurface,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.chip,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  cardContainer: {
    marginBottom: 24,
    borderRadius: 12,
  },
  ratingCard: {
    elevation: 2,
    backgroundColor: Colors.card,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ratingInner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  ratingContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  ratingLabel: {
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  ratingNumber: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  reviewCount: {
    color: Colors.onSurface,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.onSurface,
  },
  description: {
    lineHeight: 24,
    color: Colors.secondaryText,
  },
}); 