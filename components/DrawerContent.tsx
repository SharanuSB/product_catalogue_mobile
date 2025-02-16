import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Text, Avatar, Divider, IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { auth } from '@/config/firebase';
import { authStorage } from '@/utils/authStorage';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';

const DrawerItem = ({ 
  label, 
  icon, 
  onPress,
  active = false 
}: { 
  label: string;
  icon: string;
  onPress: () => void;
  active?: boolean;
}) => (
  <Pressable 
    onPress={onPress}
    style={({ pressed }) => [
      styles.drawerItem,
      active && styles.activeItem,
      pressed && styles.pressedItem
    ]}
  >
    <IconButton
      icon={icon}
      size={24}
      iconColor={active ? Colors.primary : Colors.onSurface}
    />
    <Text style={[
      styles.drawerItemText,
      active && styles.activeItemText
    ]}>
      {label}
    </Text>
  </Pressable>
);

export function DrawerContent(props: any) {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      await authStorage.removeToken();
      Toast.show({
        type: 'success',
        text1: 'Goodbye!',
        text2: 'Successfully logged out',
      });
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout. Please try again.',
      });
    }
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Icon 
            size={80} 
            icon="account-circle"
            style={styles.avatar}
            color={Colors.primary}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>Welcome</Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {auth.currentUser?.email}
            </Text>
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.drawerItems}>
        <DrawerItem
          label="Home"
          icon="home"
          onPress={() => router.push('/(tabs)/home')}
          active={true}
        />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.bottomSection}>
        <DrawerItem
          label="Logout"
          icon="logout"
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primary + '10',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: Colors.surface,
  },
  userTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: Colors.border,
  },
  drawerItems: {
    paddingVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  activeItem: {
    backgroundColor: Colors.primary + '10',
  },
  pressedItem: {
    opacity: 0.7,
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.onSurface,
    marginLeft: 8,
  },
  activeItemText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  bottomSection: {
    marginTop: 'auto',
    paddingBottom: 16,
  },
}); 