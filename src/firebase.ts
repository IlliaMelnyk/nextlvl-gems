import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Firebase config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: "nextlvl-gem",
    storageBucket: "nextlvl-gem.firebasestorage.app",
    messagingSenderId: "696885215043",
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: "G-VLX3Q9N20G"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const login = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

export { uploadToImageKit as uploadImage } from "./imageKit";
