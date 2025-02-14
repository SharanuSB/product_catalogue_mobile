import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PaperProvider>
        <Slot />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </PaperProvider>
    </Provider>
  );
} 