import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, useTheme, Provider as PaperProvider } from 'react-native-paper';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authStorage } from '@/utils/authStorage';
import { FormInput } from '@/components/ui/FormInput';
import { FormButton } from '@/components/ui/FormButton';
import Toast from 'react-native-toast-message';
import { getAuthErrorMessage } from '@/utils/getAuthErrorMessage';
import { manageUserSession, setupSessionMonitor } from '@/utils/sessionService';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Register() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all fields',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password should be at least 6 characters',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await authStorage.storeToken(token);
      
      // Add session management
      await manageUserSession(userCredential.user.uid);
      setupSessionMonitor(userCredential.user.uid);

      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'Account created successfully',
        position: 'top',
        visibilityTime: 2000,
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
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
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()} 
            style={styles.header}
          >
            <Text 
              variant="headlineLarge" 
              style={styles.title}
            >
              Create Account
            </Text>
            <Text 
              variant="bodyLarge" 
              style={styles.subtitle}
            >
              Sign up to get started
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.duration(1000).springify()}
            style={styles.formContainer}
          >
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
                secureTextEntry={!showPassword.password}
                disabled={isLoading}
                right={
                  <TextInput.Icon
                    icon={showPassword.password ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                  />
                }
              />

              <FormInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword.confirmPassword}
                disabled={isLoading}
                right={
                  <TextInput.Icon
                    icon={showPassword.confirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                  />
                }
              />

              <View style={styles.buttonContainer}>
                <FormButton
                  onPress={handleRegister}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Register
                </FormButton>

                <FormButton
                  mode="text"
                  onPress={() => router.back()}
                  disabled={isLoading}
                >
                  Already have an account? Login
                </FormButton>
              </View>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    flex: 1,
  },
  form: {
    gap: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 8,
  }
});