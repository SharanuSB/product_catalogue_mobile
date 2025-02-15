import * as SecureStore from 'expo-secure-store';
import { auth, db } from '@/config/firebase';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import uuid from 'react-native-uuid';
import { Platform } from 'react-native';

const SESSION_KEY = 'user_session_id';

export const manageUserSession = async (userId: string) => {
    try {
        const sessionId = uuid.v4().toString();
        await SecureStore.setItemAsync(SESSION_KEY, sessionId);

        const sessionRef = doc(db, 'userSessions', userId);
        await setDoc(sessionRef, {
            sessionId,
            lastLoginAt: serverTimestamp(),
            deviceInfo: {
                platform: Platform.OS,
                version: Platform.Version,
            }
        }, { merge: true });

        return sessionId;
    } catch (error) {
        console.error('Session management error:', error);
        throw error;
    }
};

let unsubscribe: (() => void) | null = null;

export const setupSessionMonitor = (userId: string) => {
    // Clean up previous listener if exists
    if (unsubscribe) {
        unsubscribe();
    }

    try {
        unsubscribe = onSnapshot(
            doc(db, 'userSessions', userId),
            {
                next: async (snapshot) => {
                    try {
                        const currentSessionId = await SecureStore.getItemAsync(SESSION_KEY);
                        const sessionData = snapshot.data();

                        if (sessionData && sessionData.sessionId !== currentSessionId) {
                            await handleForceLogout();
                        }
                    } catch (error) {
                        console.error('Session monitoring error:', error);
                    }
                },
                error: (error) => {
                    console.error('Session listener error:', error);
                }
            }
        );

        return () => {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        };
    } catch (error) {
        console.error('Setup session monitor error:', error);
        return () => { };
    }
};

const handleForceLogout = async () => {
    try {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }

        await signOut(auth);
        await SecureStore.deleteItemAsync(SESSION_KEY);

        Alert.alert(
            'Session Expired',
            'You have been logged in from another device',
            [{
                text: 'OK',
                onPress: () => {
                    router.replace('/login');
                }
            }]
        );
    } catch (error) {
        console.error('Force logout error:', error);
    }
};