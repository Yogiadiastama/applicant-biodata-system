// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: GANTI DENGAN KONFIGURASI FIREBASE PROYEK ANDA
// Ini didapat dari Project settings > General > Your apps > Web app di Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCCj-RLge1SslI6uI6YlZ8wchS2MUsX9jo",
  authDomain: "applicant-biodata-system.firebaseapp.com",
  projectId: "applicant-biodata-system",
  storageBucket: "applicant-biodata-system.firebasestorage.app",
  messagingSenderId: "515555968846",
  appId: "1:515555968846:web:db1dfd60c465f60681401f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
