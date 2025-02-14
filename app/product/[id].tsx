import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

const { width } = Dimensions.get('window');

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
        <ActivityIndicator size="large" />
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
              ${product.price}
            </Text>
            <Chip mode="outlined" style={styles.category}>
              {product.category}
            </Chip>
          </View>

          <Card style={styles.ratingCard}>
            <Card.Content style={styles.ratingContent}>
              <View>
                <Text variant="titleMedium">Rating</Text>
                <Text variant="displaySmall" style={styles.ratingNumber}>
                  {product.rating.rate}
                </Text>
              </View>
              <View>
                <Text variant="titleMedium">Reviews</Text>
                <Text variant="displaySmall" style={styles.reviewCount}>
                  {product.rating.count}
                </Text>
              </View>
            </Card.Content>
          </Card>

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
    backgroundColor: '#fff',
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  category: {
    backgroundColor: 'transparent',
  },
  ratingCard: {
    marginBottom: 24,
    elevation: 2,
  },
  ratingContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  ratingNumber: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  reviewCount: {
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
    color: '#333',
  },
}); 