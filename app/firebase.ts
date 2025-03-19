import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2keCg_oozaryyLTG4lSUW-lyk7E0UU8w",
  authDomain: "arbitration-institute.firebaseapp.com",
  projectId: "arbitration-institute",
  storageBucket: "arbitration-institute.firebasestorage.app",
  messagingSenderId: "819911977121",
  appId: "1:819911977121:web:2f77318905dca6cbede8e0",
  measurementId: "G-LZXN7RRDBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the storage service
const storage = getStorage(app);

export { storage }; 