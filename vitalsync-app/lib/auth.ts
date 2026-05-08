/**
 * Authentication utilities and helpers
 * Provides authentication-related functions
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { User, RegisterCredentials, LoginCredentials } from '@/types';
import { handleFirebaseAuthError, validateEmail, validatePassword } from './errors';
import { logger } from './logger';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { COLLECTIONS } from './constants';

const authLogger = logger.createModuleLogger('auth');

/**
 * Register a new user
 */
export async function registerUser(
  credentials: RegisterCredentials
): Promise<{ user: User; error: null } | { user: null; error: Error }> {
  try {
    // Validate inputs
    const emailValidation = validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Update user profile
    await updateProfile(userCredential.user, {
      displayName: credentials.name,
    });

    // Create user document in Firestore
    const userDoc: User = {
      uid: userCredential.user.uid,
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      createdAt: new Date(),
    };

    await setDoc(
      doc(db, COLLECTIONS.USERS, userCredential.user.uid),
      userDoc
    );

    authLogger.info(`User registered successfully: ${credentials.email}`);

    return { user: userDoc, error: null };
  } catch (error) {
    const authError = error instanceof Error ? error : new Error(String(error));
    authLogger.error(`Registration failed: ${authError.message}`, authError);
    return { user: null, error: authError };
  }
}

/**
 * Login user
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<{ user: User | null; error: null } | { user: null; error: Error }> {
  try {
    const emailValidation = validateEmail(credentials.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    // Fetch user data from Firestore
    const userDoc = await getDoc(
      doc(db, COLLECTIONS.USERS, userCredential.user.uid)
    );

    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const user = userDoc.data() as User;

    authLogger.info(`User logged in: ${credentials.email}`);

    return { user, error: null };
  } catch (error) {
    const authError = handleFirebaseAuthError(error);
    authLogger.error(`Login failed: ${authError.message}`);
    return { user: null, error: authError };
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<{ success: boolean; error: null } | { success: false; error: Error }> {
  try {
    await signOut(auth);
    authLogger.info('User logged out');
    return { success: true, error: null };
  } catch (error) {
    const authError = handleFirebaseAuthError(error);
    authLogger.error(`Logout failed: ${authError.message}`);
    return { success: false, error: authError };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(
  email: string
): Promise<{ success: boolean; error: null } | { success: false; error: Error }> {
  try {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    await sendPasswordResetEmail(auth, email);
    authLogger.info(`Password reset email sent to: ${email}`);

    return { success: true, error: null };
  } catch (error) {
    const authError = handleFirebaseAuthError(error);
    authLogger.error(`Password reset email failed: ${authError.message}`);
    return { success: false, error: authError };
  }
}

/**
 * Get current user from Firebase
 */
export async function getCurrentUser(): Promise<FirebaseUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    authLogger.error(`Failed to fetch user profile: ${error}`);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<User>
): Promise<{ success: boolean; error: null } | { success: false; error: Error }> {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, uid), updates, { merge: true });
    authLogger.info(`User profile updated: ${uid}`);
    return { success: true, error: null };
  } catch (error) {
    const authError = handleFirebaseAuthError(error);
    authLogger.error(`Profile update failed: ${authError.message}`);
    return { success: false, error: authError };
  }
}

/**
 * Check if email exists in Firestore
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const usersCollection = COLLECTIONS.USERS;
    // Note: This requires a proper Firestore query
    // Implementation depends on your Firestore structure
    return false;
  } catch (error) {
    authLogger.warn(`Email check failed: ${error}`);
    return false;
  }
}
