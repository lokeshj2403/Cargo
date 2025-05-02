// src/lib/firebase/auth.ts
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { auth } from './config'; // Import initialized auth instance

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Function to handle Google Sign-In
export const signInWithGoogle = async (): Promise<UserCredential | AuthError> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    // The signed-in user info.
    // const user = result.user;
    console.log('Google Sign-in Success:', result.user);
    return result;
  } catch (error) {
    // Handle Errors here.
    const authError = error as AuthError;
    console.error('Google Sign-in Error:', authError.code, authError.message);
    // The email of the user's account used.
    // const email = authError.customData?.email;
    // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(authError);
    return authError;
  }
};

// Function to handle Facebook Sign-In
export const signInWithFacebook = async (): Promise<UserCredential | AuthError> => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // const credential = FacebookAuthProvider.credentialFromResult(result);
    // const accessToken = credential?.accessToken;
    // The signed-in user info.
    // const user = result.user;
    console.log('Facebook Sign-in Success:', result.user);
    return result;
  } catch (error) {
    // Handle Errors here.
    const authError = error as AuthError;
    console.error('Facebook Sign-in Error:', authError.code, authError.message);
    // The email of the user's account used.
    // const email = authError.customData?.email;
    // The AuthCredential type that was used.
    // const credential = FacebookAuthProvider.credentialFromError(authError);
    // Handle specific errors like account already exists with different credential
     if (authError.code === 'auth/account-exists-with-different-credential') {
      // Handle this specific error (e.g., prompt user to link accounts or sign in differently)
       alert('An account already exists with the same email address but different sign-in credentials. Try signing in using a provider associated with this email address.');
     }
    return authError;
  }
};
