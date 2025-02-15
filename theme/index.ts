import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#007AFF',
        background: '#FFFFFF',
        surface: '#F8F8F8',
        text: '#000000',
        secondaryText: '#666666',
        border: '#E0E0E0',
        card: '#FFFFFF',
        error: '#FF3B30',
        success: '#34C759',
        elevation: {
            level0: 'transparent',
            level1: '#FFFFFF',
            level2: '#F8F8F8',
            level3: '#F0F0F0',
        },
    },
};

export const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#0A84FF',
        background: '#000000',
        surface: '#1C1C1E',
        text: '#FFFFFF',
        secondaryText: '#ADADAD',
        border: '#2C2C2E',
        card: '#1C1C1E',
        error: '#FF453A',
        success: '#32D74B',
        elevation: {
            level0: 'transparent',
            level1: '#1C1C1E',
            level2: '#2C2C2E',
            level3: '#3A3A3C',
        },
    },
};

export type AppTheme = typeof lightTheme; 