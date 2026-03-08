import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlkuqsDFJHTqMywR5H7UQcBc46U6OEmtw",
    authDomain: "anonemasi.firebaseapp.com",
    projectId: "anonemasi",
    storageBucket: "anonemasi.firebasestorage.app",
    messagingSenderId: "837775691101",
    appId: "1:837775691101:web:dccf47b4e347cf7cfbecb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
