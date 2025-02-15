import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { DrawerContent } from '@/components/DrawerContent';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: 'Home',
          drawerLabel: 'Home',
        }}
      />
    </Drawer>
  );
}
