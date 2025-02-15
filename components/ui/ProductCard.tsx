import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { Colors } from '@/theme/colors';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  category: string;
}

export const ProductCard = ({ 
  id,
  title, 
  image, 
  description, 
  price, 
  category,
}: ProductCardProps) => {
  return (
    <Pressable 
      onPress={() => router.push(`/product/${id}`)}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <Surface style={styles.surface}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text 
            variant="titleMedium" 
            numberOfLines={1} 
            style={styles.title}
          >
            {title}
          </Text>
          <Text 
            variant="bodySmall" 
            numberOfLines={2} 
            style={styles.description}
          >
            {description}
          </Text>
          <View style={styles.footer}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>
                {category}
              </Text>
            </View>
            <Text variant="titleMedium" style={styles.price}>
              {formatPrice(price)}
            </Text>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    margin: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  surface: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.onSurface,
  },
  description: {
    marginBottom: 8,
    color: Colors.secondaryText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.chip,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  price: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
}); 