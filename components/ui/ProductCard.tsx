import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  category: string;
  onPress: () => void;
}

export const ProductCard = ({ 
  id,
  title, 
  image, 
  description, 
  price, 
  category, 
  onPress 
}: ProductCardProps) => {
  return (
    <Pressable onPress={() => router.push(`/product/${id}`)}>
      <Card style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <Card.Content>
          <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
            {description}
          </Text>
          <View style={styles.footer}>
            <Chip mode="outlined">{category}</Chip>
            <Text variant="titleMedium" style={styles.price}>
              ${price}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
  },
  image: {
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
}); 