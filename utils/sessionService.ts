import * as SecureStore from 'expo-secure-store';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import uuid from 'react-native-uuid';
import { Platform } from 'react-native';

const SESSION_KEY = 'user_session_id';
let unsubscribe: (() => void) | null = null;

export const manageUserSession = async (userId: string) => {
    try {
        // Generate new session and store locally
        const sessionId = uuid.v4().toString();
        await SecureStore.setItemAsync(SESSION_KEY, sessionId);

        // Update Firestore with new session
        const sessionRef = doc(db, 'userSessions', userId);
        await setDoc(sessionRef, {
            sessionId,
            lastLoginAt: serverTimestamp(),
            deviceInfo: {
                platform: Platform.OS,
                version: Platform.Version,
            }
        }, { merge: false }); // Use merge: false to overwrite completely

        return sessionId;
    } catch (error) {
        console.error('Session management error:', error);
        throw error;
    }
};

export const setupSessionMonitor = (userId: string) => {
    cleanupSession(); // Clean up any existing listener

    try {
        const sessionRef = doc(db, 'userSessions', userId);

        unsubscribe = onSnapshot(sessionRef, {
            next: async (snapshot) => {
                if (!snapshot.exists()) return;

                const sessionData = snapshot.data();
                const currentSessionId = await SecureStore.getItemAsync(SESSION_KEY);

                if (!currentSessionId || sessionData.sessionId !== currentSessionId) {
                    await handleForceLogout();
                }
            },
            error: (error) => {
                console.error('Session listener error:', error);
            }
        });

        return unsubscribe;
    } catch (error) {
        console.error('Setup session monitor error:', error);
        return () => { };
    }
};

const handleForceLogout = async () => {
    try {
        cleanupSession();

        // Clear all local data
        await Promise.all([
            SecureStore.deleteItemAsync(SESSION_KEY),
            signOut(auth)
        ]);

        // Show alert and navigate
        Alert.alert(
            'Session Expired',
            'You have been logged in from another device',
            [{
                text: 'OK',
                onPress: () => {
                    setTimeout(() => {
                        router.replace('/login');
                    }, 100);
                }
            }],
            {
                cancelable: false,
                onDismiss: () => {
                    setTimeout(() => {
                        router.replace('/login');
                    }, 100);
                }
            }
        );
    } catch (error) {
        console.error('Force logout error:', error);
        router.replace('/login');
    }
};

export const cleanupSession = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};