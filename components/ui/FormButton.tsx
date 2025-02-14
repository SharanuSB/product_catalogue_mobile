import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface FormButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'text' | 'outlined' | 'contained';
  children: React.ReactNode;
}

export const FormButton = ({ 
  onPress, 
  loading = false, 
  disabled = false,
  mode = 'contained',
  children 
}: FormButtonProps) => {
  const theme = useTheme();

  return (
    <Button
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={styles.button}
      contentStyle={styles.buttonContent}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#007AFF',
        },
      }}
    >
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
}); 