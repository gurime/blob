// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID

  apiKey: "AIzaSyC704ayjAVmcu_gALh8UQxXvcAMoWp7v1o",

  authDomain: "portfolio-e4755.firebaseapp.com",

  projectId: "portfolio-e4755",

  storageBucket: "portfolio-e4755.firebasestorage.app",

  messagingSenderId: "1032002771148",

  appId: "1:1032002771148:web:957dec520e3327f0e88a69"


};

// vInitialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
