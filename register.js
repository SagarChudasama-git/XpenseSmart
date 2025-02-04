// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOZ9Cciv0cbUzVv5Vg1Z7RgbawZkcyVn4",
  authDomain: "login-eda43.firebaseapp.com",
  projectId: "login-eda43",
  storageBucket: "login-eda43.firebasestorage.app",
  messagingSenderId: "976813018557",
  appId: "1:976813018557:web:c9724481b17fa17f4856d4",
  measurementId: "G-SWFM3PRDN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);