import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  right?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const FormInput = ({ 
  label, 
  value, 
  onChangeText,
  secureTextEntry = false,
  right,
  disabled = false,
  error = false,
  keyboardType = 'default',
  autoCapitalize = 'none'
}: FormInputProps) => {
  const theme = useTheme();

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      right={right}
      disabled={disabled}
      error={error}
      mode="outlined"
      style={styles.input}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#007AFF',
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
}); 