// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-f1e57.firebaseapp.com",
  projectId: "mern-blog-f1e57",
  storageBucket: "mern-blog-f1e57.appspot.com",
  messagingSenderId: "348996553241",
  appId: "1:348996553241:web:768293398cd91dd3faf888",
  measurementId: "G-7RX18J2K44"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
