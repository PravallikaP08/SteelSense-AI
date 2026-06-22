import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForNowPleaseChangeMe",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "steelsenseai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "steelsenseai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "steelsenseai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      name: user.displayName,
      email: user.email,
      googleId: user.uid,
      imageUrl: user.photoURL
    };
  } catch (error) {
    console.error("Firebase Google Auth Error:", error);
    
    // Map Firebase errors to human-readable messages
    let errorMessage = "An unknown error occurred during authentication.";
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = "Sign-in popup was closed before completing.";
        break;
      case 'auth/popup-blocked':
        errorMessage = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
        break;
      case 'auth/network-request-failed':
        errorMessage = "Network error. Please check your internet connection.";
        break;
      case 'auth/unauthorized-domain':
        errorMessage = "This domain is not authorized for OAuth operations for your Firebase project.";
        break;
      case 'auth/invalid-api-key':
        errorMessage = "Invalid Firebase API Key. Please check your configuration.";
        break;
      default:
        errorMessage = error.message || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
};
