// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsePtJ4_xLxmakgmaHINoTL8xD2vNoYRc",
  authDomain: "strathmorecommunityportal.firebaseapp.com",
  projectId: "strathmorecommunityportal",
  storageBucket: "strathmorecommunityportal.firebasestorage.app",
  messagingSenderId: "842667716473",
  appId: "1:842667716473:web:3a45551e8d0dc3836889a8",
  measurementId: "G-1C5W41ZG1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Create Google Auth Provider instance
const googleProvider = new GoogleAuthProvider();

// Custom function to handle Google Sign-In
const signInWithGoogle = async () => {
  try {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Use redirect for mobile devices
      await signInWithRedirect(auth, googleProvider);
    } else {
      // Use popup for desktop
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Function to handle redirect result
const handleGoogleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      return result.user;
    }
  } catch (error) {
    console.error("Google redirect error:", error);
    throw error;
  }
};

// Export all services
export { 
  app, 
  analytics, 
  auth, 
  db, 
  storage,
  googleProvider,
  signInWithGoogle,
  handleGoogleRedirect
};