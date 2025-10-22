// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZj4dXoEnE5vnjkwltfHzQd-yN0Q7Kx_o",
  authDomain: "alergo-trecker.firebaseapp.com",
  projectId: "alergo-trecker",
  storageBucket: "alergo-trecker.firebasestorage.app",
  messagingSenderId: "122139720523",
  appId: "1:122139720523:web:fae8f42cb7e318e6d386ce",
  measurementId: "G-1N45JP6MDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };