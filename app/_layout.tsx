import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Slot, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import Toast, { BaseToast, ErrorToast, ToastProps } from 'react-native-toast-message';
import { authStorage } from '@/utils/authStorage';
import { store } from '@/store';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007AFF',
  },
};

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ 
        borderLeftColor: '#34C759',
        backgroundColor: '#fff'
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '500'
      }}
      text2Style={{
        fontSize: 13
      }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      style={{ 
        borderLeftColor: '#FF3B30',
        backgroundColor: '#fff'
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '500'
      }}
      text2Style={{
        fontSize: 13
      }}
    />
  )
};

type RouteType = '/login' | '/(tabs)/home';

function RootLayoutNav() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<RouteType | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await authStorage.getToken();
        setIsLoading(false);
        setInitialRoute(token ? '/(tabs)/home' : '/login');
      } catch (error) {
        console.error('Auth error:', error);
        setIsLoading(false);
        setInitialRoute('/login');
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && initialRoute) {
      router.replace(initialRoute);
    }
  }, [isLoading, initialRoute]);

  if (isLoading || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Slot />
      <StatusBar style="dark" />
      <Toast config={toastConfig} />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
} 