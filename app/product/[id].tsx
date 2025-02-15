import React from 'react';
import { StyleSheet, View, ScrollView, Image, Dimensions } from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { Colors } from '@/theme/colors';
import { formatPrice } from '@/utils/formatPrice';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useSelector((state: RootState) => 
    state.products.items.find(item => item.id === Number(id))
  );

  if (!product) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>

        <Animated.View 
          entering={FadeIn}
          style={styles.content}
        >
          <Surface style={styles.imageContainer}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.image}
              resizeMode="contain"
            />
          </Surface>

          <View style={styles.details}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            <Text style={styles.title}>
              {product.title}
            </Text>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                ⭐️ {product.rating.rate} ({product.rating.count} reviews)
              </Text>
            </View>

            <Text style={styles.price}>
              {formatPrice(product.price)}
            </Text>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>About this item</Text>
              <Text style={styles.description}>
                {product.description}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: Colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: 20,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.primary + '10',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.onSurface,
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  descriptionContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.secondaryText,
  },
}); 