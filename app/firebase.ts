import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration with environment variable fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA2keCg_oozaryyLTG4lSUW-lyk7E0UU8w",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "arbitration-institute.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "arbitration-institute",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "arbitration-institute.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "819911977121",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:819911977121:web:2f77318905dca6cbede8e0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LZXN7RRDBS"
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let storage: FirebaseStorage;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Get the storage service
  storage = getStorage(app);
  
  console.log("[Firebase] Initialized successfully");
} catch (error) {
  console.error("[Firebase] Initialization error:", error);
  throw new Error("Failed to initialize Firebase");
}

export { storage }; 