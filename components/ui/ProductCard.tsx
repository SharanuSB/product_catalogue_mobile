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
        <Image 
          source={{ uri: image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text 
            variant="titleMedium" 
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text 
            variant="bodySmall" 
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Text>
          <View style={styles.footer}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText} numberOfLines={1}>
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
    height: 280,
  },
  surface: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    flex: 1,
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
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    flex: 1,
    marginRight: 8,
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