import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBAZrLQnRYiR2yOOK8FjCiNR4K5_S7bmPs",
    authDomain: "rbproj-b05f2.firebaseapp.com",
    projectId: "rbproj-b05f2",
    storageBucket: "rbproj-b05f2.firebasestorage.app",
    messagingSenderId: "875505369912",
    appId: "1:875505369912:android:fb27e9f428826bce2677cd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 