import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, IconButton, Provider as PaperProvider, TextInput, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authStorage } from '@/utils/authStorage';
import { FormInput } from '@/components/ui/FormInput';
import { FormButton } from '@/components/ui/FormButton';
import Toast from 'react-native-toast-message';
import { Colors } from '@/theme/colors';
import { getAuthErrorMessage } from '@/utils/getAuthErrorMessage';
import { manageUserSession, setupSessionMonitor } from '@/utils/sessionService';

export default function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState('sharanusb12345@gmail.com');
  const [password, setPassword] = useState('Sharanu@1032');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all fields',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await authStorage.storeToken(token);
      
      await manageUserSession(userCredential.user.uid);
      setupSessionMonitor(userCredential.user.uid);

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Successfully logged in',
        position: 'top',
        visibilityTime: 2000,
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: getAuthErrorMessage(error),
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text 
              variant="headlineLarge" 
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              Welcome Back
            </Text>
            <Text 
              variant="bodyLarge" 
              style={[styles.subtitle, { color: theme.colors.secondary }]}
            >
              Login to continue
            </Text>
          </View>

          <View style={styles.form}>
            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              disabled={isLoading}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <FormButton
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </FormButton>

            <FormButton
              mode="text"
              onPress={() => router.push('/register')}
              disabled={isLoading}
            >
              Don't have an account? Register
            </FormButton>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
}); 