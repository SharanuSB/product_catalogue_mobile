import { MD3Colors } from 'react-native-paper/lib/typescript/types';

export const Colors: MD3Colors & {
    secondaryText: string;
    border: string;
    card: string;
    chip: string;
    shadow: string;
    surfaceDisabled: string;
    onSurfaceDisabled: string;
    backdrop: string;
} = {
    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#007AFF',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#666666',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#666666',
    onSecondaryContainer: '#FFFFFF',
    tertiary: '#666666',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#666666',
    onTertiaryContainer: '#FFFFFF',
    error: '#FF3B30',
    onError: '#FFFFFF',
    errorContainer: '#FF3B30',
    onErrorContainer: '#FFFFFF',
    background: '#FFFFFF',
    onBackground: '#1A1A1A',
    surface: '#F8F8F8',
    onSurface: '#1A1A1A',
    surfaceVariant: '#F0F0F0',
    onSurfaceVariant: '#1A1A1A',
    outline: '#E0E0E0',
    outlineVariant: '#E0E0E0',
    scrim: 'rgba(0,0,0,0.5)',
    inverseSurface: '#1A1A1A',
    inverseOnSurface: '#FFFFFF',
    inversePrimary: '#007AFF',
    // Custom properties
    secondaryText: '#666666',
    border: '#E0E0E0',
    card: '#FFFFFF',
    chip: '#F0F0F0',
    shadow: '#000000',
    // Required by MD3Colors
    elevation: {
        level0: 'transparent',
        level1: '#FFFFFF',
        level2: '#F8F8F8',
        level3: '#F0F0F0',
        level4: '#F0F0F0',
        level5: '#F0F0F0',
    },
    // Add these missing MD3Colors properties
    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
}; 