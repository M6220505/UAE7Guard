import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  Unsubscribe
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
function validateFirebaseConfig() {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration:', missingKeys);
    throw new Error(
      `Firebase configuration incomplete. Missing: ${missingKeys.join(', ')}\n` +
      'Please set these environment variables in your .env file:\n' +
      missingKeys.map(key => `VITE_FIREBASE_${key.toUpperCase()}`).join('\n')
    );
  }
}

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp;
let auth: Auth;

export function initializeFirebase(): { app: FirebaseApp; auth: Auth } {
  if (!getApps().length) {
    validateFirebaseConfig();
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Set persistence based on platform
    const persistence = Capacitor.isNativePlatform()
      ? indexedDBLocalPersistence
      : browserLocalPersistence;

    setPersistence(auth, persistence).catch((error) => {
      console.error('Failed to set auth persistence:', error);
    });
  } else {
    app = getApps()[0];
    auth = getAuth(app);
  }

  return { app, auth };
}

// Export initialized instances
export const { app: firebaseApp, auth: firebaseAuth } = initializeFirebase();

/**
 * Sign in with Apple using Firebase Authentication
 * Uses popup on web, redirect on native iOS
 */
export async function signInWithApple(): Promise<FirebaseUser> {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  try {
    // Use redirect on native iOS for better UX
    if (Capacitor.getPlatform() === 'ios') {
      await signInWithRedirect(firebaseAuth, provider);
      // The result will be handled by getRedirectResult in auth state listener
      throw new Error('REDIRECT_IN_PROGRESS');
    } else {
      // Use popup on web
      const result = await signInWithPopup(firebaseAuth, provider);
      return result.user;
    }
  } catch (error: any) {
    if (error.message === 'REDIRECT_IN_PROGRESS') {
      throw error;
    }
    console.error('Sign in with Apple error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Check for redirect result after Apple Sign In on iOS
 */
export async function checkAppleSignInRedirect(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(firebaseAuth);
    return result?.user || null;
  } catch (error: any) {
    console.error('Apple Sign In redirect error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Sign in with Email and Password
 */
export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  try {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Email sign in error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Create new account with Email and Password
 */
export async function signUpWithEmail(email: string, password: string): Promise<FirebaseUser> {
  try {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    return result.user;
  } catch (error: any) {
    console.error('Email sign up error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(firebaseAuth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(firebaseAuth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
}

/**
 * Get current Firebase user
 */
export function getCurrentUser(): FirebaseUser | null {
  return firebaseAuth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(firebaseAuth, callback);
}

/**
 * Get Firebase ID token for API authentication
 */
export async function getIdToken(): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('Failed to get ID token:', error);
    return null;
  }
}

/**
 * Convert Firebase error codes to user-friendly messages
 */
function getFirebaseErrorMessage(error: any): string {
  const errorCode = error.code || '';

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in or use a different email.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up blocked by browser. Please allow pop-ups and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

// Export types
export type { FirebaseUser, Unsubscribe };
