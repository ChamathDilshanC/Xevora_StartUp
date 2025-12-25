import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Initialize providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
const appleProvider = new OAuthProvider('apple.com');

// User data interface
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: any;
  lastLogin: any;
}

/**
 * Save or update user data in Firestore
 * Silently fails if Firestore is not initialized
 * Has a 3-second timeout to prevent long waits
 */
async function saveUserToFirestore(user: User) {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore timeout')), 3000)
    );

    // Race between Firestore operation and timeout
    await Promise.race([
      (async () => {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        const userData: UserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: userSnap.exists()
            ? userSnap.data().createdAt
            : serverTimestamp(),
          lastLogin: serverTimestamp(),
        };

        await setDoc(userRef, userData, { merge: true });
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    // Silently fail if Firestore is not initialized or offline
    // Authentication will still work
    console.warn(
      'Firestore save failed (this is OK if Firestore is not set up yet):',
      error
    );
  }
}

/**
 * Check if user exists in Firestore
 */
export async function checkUserExists(email: string): Promise<boolean> {
  // Note: This is a simplified check. In production, you might want to use
  // Firebase Auth's fetchSignInMethodsForEmail or a custom backend endpoint
  try {
    // We'll check during sign-in attempt instead
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Fire-and-forget: don't wait for Firestore save
    saveUserToFirestore(result.user);
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    // Fire-and-forget: don't wait for Firestore save
    saveUserToFirestore(result.user);
    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Apple');
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Fire-and-forget: don't wait for Firestore save
    saveUserToFirestore(result.user);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error(
        'Invalid email or password. Please check your credentials and try again.'
      );
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email. Please sign up.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('This account has been disabled.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    }
    throw new Error(error.message || 'Failed to sign in');
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Fire-and-forget: don't wait for Firestore save
    saveUserToFirestore(result.user);
    return result;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error(
        'An account with this email already exists. Please sign in.'
      );
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password should be at least 6 characters.');
    }
    throw new Error(error.message || 'Failed to create account');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address.');
    }
    throw new Error(error.message || 'Failed to send reset email');
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
