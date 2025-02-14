import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'auth_token';

export const authStorage = {
    async storeToken(token: string) {
        try {
            await SecureStore.setItemAsync(STORAGE_KEY, token);
            const stored = await SecureStore.getItemAsync(STORAGE_KEY);
            console.log("Verification - stored token:", stored);
        } catch (error) {
            console.error('Error storing token:', error);
            throw error;
        }
    },

    async getToken() {
        try {
            const token = await SecureStore.getItemAsync(STORAGE_KEY);
            console.log("Retrieved token:", token);
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    async removeToken() {
        try {
            await SecureStore.deleteItemAsync(STORAGE_KEY);
            console.log("Token removed successfully");
        } catch (error) {
            console.error('Error removing token:', error);
            throw error;
        }
    }
}; 