export const getAuthErrorMessage = (error: any): string => {
    const errorCode = error?.code || '';

    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Invalid email address format';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/email-already-in-use':
            return 'Email is already registered';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later';
        default:
            return error?.message || 'An unexpected error occurred';
    }
}; 